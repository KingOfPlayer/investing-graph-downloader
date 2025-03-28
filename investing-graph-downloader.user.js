// ==UserScript==
// @name         investing-graph-downloader
// @namespace    https://github.com/KingOfPlayer/investing-graph-downloader
// @version      0.1.3
// @description  Download Data From Graph
// @author       https://github.com/KingOfPlayer
// @match        *://*.investing.com/*/index*-prod.html*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    window.XMLHttpRequest.prototype.oldopen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (window.extractedUrl == undefined) {
            if (url.includes("history")) {
                window.extractedUrl = url.split("&")[0];
            }
        }

        this.oldopen(method, url, async, user, password);
    };

    window.entryData = [];
    window.downloadReady = true;

    window.addData = function (a) {
        try {
            let Entry;
            for (let i = 0; i < a.t.length; i++) {
                Entry = [a.t[i], a.v[i], a.o[i], a.h[i], a.l[i], a.c[i]];
                window.entryData.push(Entry);
            }
        } catch (err) { }
    };

    window.downloadData = function () {
        window.entryData = window.entryData.sort(function (a, b) {
            return a[0] > b[0];
        });

        let blob = new Blob([JSON.stringify(window.entryData)], { type: "text/plain" });
        let dataUrl = URL.createObjectURL(blob);
        let dataLink = document.createElement("a");

        dataLink.href = dataUrl;
        dataLink.download = window.chartName + "-" + window.mode + "-" + window.dateStart + "-" + window.dateEnd + ".JSON";
        dataLink.click();

        URL.revokeObjectURL(dataUrl);
        window.setTextDownloadButton("Download");
        window.downloadReady = true;
    };

    window.startDownload = function () {
        window.dateStart = Math.round(new Date(window.opts.firstChild.firstChild.getElementsByClassName("Start")[0].value).getTime() / 1000);
        window.dateEnd = Math.round(new Date(window.opts.firstChild.firstChild.getElementsByClassName("End")[0].value).getTime() / 1000);

        if (window.dateStart > window.dateEnd) {
            alert("End Date cannot behind start date");
            return;
        }

        if (window.dateStart < Math.round(new Date().getTime() / 1000) - (60 * 60 * 24 * 356 * 2)) {
            alert("Start date range min is " + new Date(new Date().getTime() - 60 * 60 * 24 * 356 * 2 * 1000).toString());
            return;
        }

        if (window.downloadReady == true) {
            window.downloadReady = false;
            window.mode = window.opts.firstChild.firstChild.getElementsByClassName("selected")[0].innerHTML;
            window.getData();
            window.setTextDownloadButton("Downloading");
        }
    };

    window.recursiveDownload = function (a) {
        setTimeout(function () {
            let op = "&resolution=" + window.mode;
            let opStart = "&from=" + (window.dateStart + a * window.partLength);
            let opEnd = "&to=" + (window.dateStart + (a + 1) * window.partLength);
            let GeneratedUrl = window.extractedUrl + op + opStart + opEnd;

            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    window.addData(JSON.parse(xhr.responseText));
                    window.partDone++;

                    if (window.partDone == window.partCount) {
                        window.downloadData();
                    } else {
                        window.recursiveDownload(a + 1);
                    }
                }
            }
            xhr.open('GET', GeneratedUrl, true);
            xhr.send(null);
        }, 100);
    };

    window.getData = function () {
        window.partCount = Math.ceil((window.dateEnd - window.dateStart) / 60 / 60 / 24 / 30);
        window.partLength = Math.round((window.dateEnd - window.dateStart) / window.partCount);
        window.partDone = 0;
        window.entryData = [];
        window.recursiveDownload(0);
    };

    window.selectOp = function (e) {
        window.opts.firstChild.firstChild.getElementsByClassName("selected")[0].classList.remove("selected");
        e.srcElement.classList.add("selected");
    };

    window.setTextDownloadButton = function (a) {
        window.downloadButton.innerHTML = a;
    };

    setTimeout(function () {
        window.chart = document.getElementById("tv_chart_container").firstChild;
        window.chartName = window.chart.contentDocument.getElementsByClassName("pane-legend-line apply-overflow-tooltip main")[0].innerHTML.replaceAll(" ", "-").split(",")[0];;
        window.chart.contentDocument.getElementsByClassName("tv-close-panel top")[0].click();
        window.bar = window.chart.contentDocument.getElementsByClassName("left")[0];

        window.opts = document.createElement("div");
        window.opts.className = "group space-single header-group-intervals";
        window.opts.innerHTML = '<div class="intervals-container favored-list-container no-first">'
            + '<div class="quick">'
            + '<span class="apply-common-tooltip op">5</span>'
            + '<span class="apply-common-tooltip op">15</span>'
            + '<span class="apply-common-tooltip op">30</span>'
            + '<span class="apply-common-tooltip op">45</span>'
            + '<span class="apply-common-tooltip op">60</span>'
            + '<span class="apply-common-tooltip op selected">D</span>'
            + '<span class="apply-common-tooltip op">W</span>'
            + '<span class="apply-common-tooltip op">M</span>'
            + '<input class="apply-common-tooltip symbol-edit Start" style="width: 13rem;float: none;" type="datetime-local" value="' + new Date().toISOString().slice(0, -5) + '">'
            + '<input class="apply-common-tooltip symbol-edit End" style="width: 13rem;float: none;" type="datetime-local" value="' + new Date().toISOString().slice(0, -5) + '">'
            + '<span class="apply-common-tooltip download">Download</span>'
            + '</div>'
            + '</div>';
        window.bar.appendChild(window.opts);

        let ops = window.opts.firstChild.firstChild.getElementsByClassName("op");
        for (let i = 0; i < ops.length; i++) {
            ops[i].addEventListener("click", window.selectOp);
        }

        window.downloadButton = window.opts.firstChild.firstChild.getElementsByClassName("download")[0];
        window.downloadButton.addEventListener("click", window.startDownload);
        window.chart.contentDocument.getElementsByClassName("tv-close-panel bottom")[0].click();

        console.log("Elements Loaded");
    }, 2000);

    console.log("Functions Loaded");
})();

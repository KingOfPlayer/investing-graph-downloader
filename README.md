# investing-graph-downloader

This repo aims to generate stock market data set (OHLC data).

## Install

Its userscript. It need extension "Tampermonkey".
[Userscript](https://raw.githubusercontent.com/KingOfPlayer/investing-graph-downloader/main/investing-graph-downloader.user.js)

## Data struct
```
[
	[ 
		Int Time(Second Type Epoch Time),
		Int Volume,
		float Open,float High,
		loat Low,
		float Close
	],
	...
]
```
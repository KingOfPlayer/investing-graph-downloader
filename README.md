# investing-graph-downloader

This repo aims to generate stock market data set from investing.com (OHLC data).

## Install

Its userscript. It need web extension [Tampermonkey](https://www.tampermonkey.net/).
[Click For Install](https://raw.githubusercontent.com/KingOfPlayer/investing-graph-downloader/main/investing-graph-downloader.user.js)

## Usage

Enter any chart view. Select range, data frequency and click download button.</br>
"STOCK_MARKET_NAME-START_EPOCH_TIME-END_EPOC_TIME.JSON" as file name will download.</br>
UI only enabled when enter chart view.</br>
Url form must be this `https://www.investing.com/*/*-chart`

## Data struct
```
[
	[ 
		int Time(Second Type Epoch Time),
		int Volume,
		float Open,
		float High,
		float Low,
		float Close
	],
	...
]
```

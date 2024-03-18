# investing-graph-downloader

This repo aims to generate stock market data set from investing.com (OHLC data).

## Install

Its userscript. It need extension "Tampermonkey".
[Userscript](https://raw.githubusercontent.com/KingOfPlayer/investing-graph-downloader/main/investing-graph-downloader.user.js)

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

# ffmpeg-split-multiple
use to split an audio file into multiple audio files

Generates the `ffmpeg` commands for splitting an audio file into multiple audio files.

example input ([text file](./example/song.txt))
```
00:00 Introduction
00:12 First song title
02:45 Second song title
05:55 Third song title
```
example command
```shell
node split-music.js example/song.m4a example/song.txt
```

example output
```shell
# create folder from audio file ('example/song.m4a') without extension ('.m4a')
mkdir "example/song"

# create one audio file per input.txt line, with end time taken from next line
# create the file in the folder
# filename prefixed with track number (first line = 01)
# ignores empty lines
ffmpeg -ss 00:00 -i "example/song.m4a" -to 00:00:12 "example/song/01 - Introduction.m4a"
ffmpeg -ss 00:12 -i "example/song.m4a" -to 00:02:33 "example/song/02 - First song title.m4a"
ffmpeg -ss 02:45 -i "example/song.m4a" -to 00:03:10 "example/song/03 - Second song title.m4a"
ffmpeg -ss 05:55 -i "example/song.m4a"  "example/song/04 - Third song title.m4a"
```
Note that the output's `-to` has the song's 'duration' (instead of 'end') as is required by `ffmpeg`.

## prerequisites
```shell
brew install ffmpeg
brew install nvm # or whatver you use to install node
nvm install --lts
```

## using it
```shell
mkdir foo
cd foo

node split-music.js example/song.m4a example/song.txt | pbcopy

# the script is now in your clipboard (assuming mac)
# paste it and press enter!
```
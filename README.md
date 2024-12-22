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

### Autocomplete shorthand 
Autocomplete shorthand, for when you have a bunch of files you want to split.
Assumes you have the song and txt next to each other, with exactly the same name, other than the extension (eg. `my-songs.m4a` and `songs.txt`)
```shell
some/folder/nested/deeply/my-songs.txt
some/folder/nested/deeply/my-songs.m4a
some/folder/nested/deeply/some-other-songs.txt
some/folder/nested/deeply/some-other-songs.m4a
some/folder/nested/deeply/even-more-songs.txt
some/folder/nested/deeply/even-more-songs.m4a
```
Create a shorthand script `shorthand.sh`
```shell
# shorthand.sh
node split-music.js "${1}m4a" "${1}txt"
```
This works nicely with autocomplete, because it stops on the `.` of the extension :-)
```shell
./shorthand.sh some/folder/nested/deeply/my-songs.
./shorthand.sh some/folder/nested/deeply/some-other-songs.
./shorthand.sh some/folder/nested/deeply/even-more-songs.
```

## troubleshooting

### pipe into zsh skips lines?
```shell
node split-music.js example/song.m4a example/song.txt | zsh
```
#### Problem
For some reason random lines were skipped.
One folder had only odd track numbers, all even tracks missing.
Another had random track numbers missing.
#### Solution
Fixed by copy pasting the commands (all at once worked) instead of piping into zsh.
Still don't know why
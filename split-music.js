const sourceFilename = process.argv[2];
const metadataSplitFilename = process.argv[3];

const destFolder = sourceFilename.replace(/\.[^/.]+$/, '');
const sourceFileExtension = sourceFilename.replace(/^.*\./, '');

/*
expecting a file 'scratch_25.txt' with a single line like the following
[[00:00](https://www.youtube.com/watch?v=CFGLoQIhmow&list=PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4&index=5&t=0s)] No Spirit - Memories We Made [[03:47](https://www.youtube.com/watch?v=CFGLoQIhmow&list=PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4&index=5&t=227s)] S N U G, Mondo Loops - Night Coffee [[06:20](https://www.youtube.com/watch?v=CFGLoQIhmow&list=PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4&index=5&t=380s)] Yasumu - We Met
*/
function toSeconds(s) {
  let seconds = 0;
  const parts = s.split(':').reverse();
  for (let i = 0; i < parts.length; i++) {
    seconds += Math.pow(60, i) * +parts[i];
  }
  return seconds;
}

function leftpad0(s) {
  return s.toString().length < 2 ? '0' + s : '' + s;
}

function fromSeconds(s) {
  const hours = Math.floor(s / 3600), minutes = Math.floor((s / 60) % 60), seconds = s % 60;
  return `${leftpad0(hours)}:${leftpad0(minutes)}:${leftpad0(seconds)}`;
}

let lines = (require('fs')).readFileSync(metadataSplitFilename).toString();
let times = lines
  // .replaceAll('[[', '\n[[')
  .split('\n').filter(line => line)
  // .map(l => l.match(/\[\[(.*)]\(.*\)] (.*)/))
  .map(l => l.match(/([^ ]*) (.*)/))
  .map(matches => ({
    start: matches[1].trim(),
    title: matches[2].trim()
  }));

times = times
  .map((t, index0) => {
    const next = times[index0 + 1] || {
      start: fromSeconds(NaN)
    };
    return {
      ...t,
      index1: leftpad0(index0 + 1),
      end: next.start
    };
  })
  .map(t => ({
    ...t,
    duration: fromSeconds(toSeconds(t.end) - toSeconds(t.start))
  }))
  .map(t => {
    let to = '';
    if (t.end !== fromSeconds(NaN)) {
      to = `-to ${t.duration}`;
    }
    return `ffmpeg -ss ${t.start} -i "${sourceFilename}" ${to} "${destFolder}/${t.index1} - ${t.title}.${sourceFileExtension}"`;
  });

console.log(`mkdir "${destFolder}"`);
times.forEach(l => console.log(l));

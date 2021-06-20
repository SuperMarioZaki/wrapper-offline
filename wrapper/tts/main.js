const voices = require('./info').voices;
const get = require('../request/get');
const qs = require('querystring');
const https = require('https');

module.exports = function (voiceName, text) {
	return new Promise((res, rej) => {
		const voice = voices[voiceName];
		switch (voice.source) {
			case 'polly': {
				var buffers = [];
				var req = https.request({
					hostname: 'pollyvoices.com',
					port: '443',
					path: '/api/sound/add',
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}, r => {
					r.on('data', b => buffers.push(b));
					r.on('end', () => {
						var json = JSON.parse(Buffer.concat(buffers));
						if (json.file)
							get(`https://pollyvoices.com${json.file}`).then(res);
						else
							rej();
					});
				});
				req.write(qs.encode({ text: text, voice: voice.arg }));
				req.end();
				break;
			}
			case 'cepstral':
			case 'voiceforge': {
				https.get('https://www.voiceforge.com/demo', r => {
					const cookie = r.headers['set-cookie'];
					var q = qs.encode({
						voice: voice.arg,
						voiceText: text,
					});
					var buffers = [];
					var req = https.get({
						host: 'www.voiceforge.com',
						path: `/demos/createAudio.php?${q}`,
						headers: { Cookie: cookie },
						method: 'GET',
					}, r => {
						r.on('data', b => buffers.push(b));
						r.on('end', () => {
							const html = Buffer.concat(buffers);
							const beg = html.indexOf('id="mp3Source" src="') + 20;
							const end = html.indexOf('"', beg);
							const loc = html.subarray(beg, end).toString();
							get(`https://www.voiceforge.com${loc}`).then(res).catch(rej);
						});
					});
				});
				break;
			}
			case 'vocalware': {
				var q = qs.encode({
					EID: voice.arg[0],
					LID: voice.arg[1],
					VID: voice.arg[2],
					TXT: text,
					IS_UTF8: 1,
					HTTP_ERR: 1,
					ACC: 3314795,
					API: 2292376,
					vwApiVersion: 2,
					CB: 'vw_mc.vwCallback',
				});
				var req = https.get({
					host: 'cache-a.oddcast.com',
					path: `/tts/gen.php?${q}`,
					method: 'GET',
					headers: {
						Referer: 'https://www.vocalware.com/index/demo',
						Origin: 'https://www.vocalware.com',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
					},
				}, r => {
					var buffers = [];
					r.on('data', d => buffers.push(d));
					r.on('end', () => res(Buffer.concat(buffers)));
					r.on('error', rej);
				});
				break;
			}
			case 'voicery': {
				var q = qs.encode({
					text: text,
					speaker: voice.arg,
					ssml: text.includes('<'),
				});
				https.get({
<<<<<<< HEAD
					host: 'text-to-speech-demo.ng.bluemix.net',
					path: `/api/v3/synthesize?${q}`,
=======
					host: 'www.voicery.com',
					path: `/api/generate?${q}`,
>>>>>>> parent of 02c3713c (Readloud fix, updated outdated TTS system, added voiceclip importing workaround)
				}, r => {
					var buffers = [];
					r.on('data', d => buffers.push(d));
					r.on('end', () => res(Buffer.concat(buffers)));
					r.on('error', rej);
<<<<<<< HEAD
				});
				break;
			}
			case "voiceforge": {
				/* Special thanks to ItsCrazyScout for helping us find the new VoiceForge link! */
				var q = qs.encode({
					voice: voice.arg,
					msg: text,
=======
>>>>>>> parent of 02c3713c (Readloud fix, updated outdated TTS system, added voiceclip importing workaround)
				});
				break;
			}
<<<<<<< HEAD
			case "acapela": {
                var buffers = [];
                var req = https.request({
                        hostname: "acapela-box.com",
                        path: "/AcaBox/dovaas.php",
                        method: "POST",
                        headers: {
							"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
							Cookie: "AcaBoxLogged=logged; AcaBoxUsername=acaboxuserkeeg; acabox=5v8gucusuhq022ffn4gb9rops5; AcaBoxFirstname=d",
							Origin: "https://acapela-box.com",
							Referer: "https://acapela-box.com/AcaBox/index.php",
							"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36",
							"X-Requested-With": "XMLHttpRequest",
                        },
                    },
                    (r) => {
                        r.on("data", (b) => buffers.push(b));
                        r.on("end", () => {
                            var json = JSON.parse(Buffer.concat(buffers));
							get(`${json.snd_url}`).then(res).catch(rej);
                        });
                    }
                );
                req.write(qs.encode({
                    text: text,
                    voice: voice.arg,
					listen: 1,
					format: "MP3",
					codecMP3: 1,
					spd: 180,
					vct: 100,
					byline: 0,
					ts: 666
                }));
                req.end();
                break;
            }
			case "acapelaOld": {
				var q = qs.encode({
					inputText: base64.encode(text),
				});
				https.get(
					{
						host: "voice.reverso.net",
						path: `/RestPronunciation.svc/v1/output=json/GetVoiceStream/voiceName=${voice.arg}?${q}`,
					},
					(r) => {
						var buffers = [];
						r.on("data", (d) => buffers.push(d));
						r.on("end", () => res(Buffer.concat(buffers)));
						r.on("error", rej);
					}
				);
				break;
			}
			case "svox": {
=======
			case 'watson': {
>>>>>>> parent of 02c3713c (Readloud fix, updated outdated TTS system, added voiceclip importing workaround)
				var q = qs.encode({
					text: text,
					voice: voice.arg,
					download: true,
					accept: "audio/mp3",
				});
				console.log(https.get({
					host: 'text-to-speech-demo.ng.bluemix.net',
					path: `/api/v1/synthesize?${q}`,
					headers: {
						Referer: 'https://www.vocalware.com/index/demo',
						Origin: 'https://www.vocalware.com',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
					},
				}, r => {
					var buffers = [];
					r.on('data', d => buffers.push(d));
					r.on('end', () => res(Buffer.concat(buffers)));
					r.on('error', rej);
				}));
				break;
			}
		}
	});
}

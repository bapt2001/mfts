import { VideoEntityFactory } from '@model/entity/video-entity';
import { IJsonVideo } from '@data/json/data-videos';
import { VideoSourceEntityFactory } from '@model/entity/video-source-entity';

describe('VideoEntity from IJsonVideo', () => {
    const jsonVideo: IJsonVideo = {
        video_id: 'the_video_id',
        covers: ['cover_1.jpg'],
        sources: [
            {
                src: 'intro.mp4',
                priority: 20,
                type: 'video/type/mp4',
            },
            {
                src: 'intro.webm',
                priority: 10,
                codecs: 'vp9',
            },
        ],
        tracks: {
            en: 'test.en.vtt',
            fr: 'test.fr.vtt',
        },
        meta: {
            duration: 100,
            width: 720,
            height: 596,
        },
    };

    const jsonVideoBackup = JSON.stringify(jsonVideo);

    const video = VideoEntityFactory.createFromJson(jsonVideo);

    test('properties', () => {
        expect(video.videoId).toEqual('the_video_id');
        expect(video.duration).toEqual(100);
        expect(video.getFormattedDuration()).toEqual('00:01:40');
    });

    test('videoSources', () => {
        const unsortedSrcs = video.getSources(false);
        expect(unsortedSrcs.length).toEqual(2);
        expect(unsortedSrcs[0]).toEqual(VideoSourceEntityFactory.createFromJson(jsonVideo.sources[0]));
    });

    test('immutability', () => {
        expect(jsonVideoBackup).toEqual(JSON.stringify(jsonVideo));
    });
});
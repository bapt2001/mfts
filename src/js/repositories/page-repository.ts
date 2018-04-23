import {
    IDataPage,
    IDataPageLocalizedAudioSource,
    IDataPageLocalizedVideoEntity,
    IDataPageVideoEntity,
} from '@data/data-pages';

export interface IDataPageWithMedia extends IDataPage {
    videos: any[];
    audio?: any;
    subtitle?: any;
}

export default class PageRepository {
    public readonly data: IDataPage[];

    constructor(data: IDataPage[]) {
        this.data = data;
    }

    /**
     * Get raw page information
     * @param {string} id
     * @returns {Promise<IDataPage>}
     */
    async get(id: string): Promise<IDataPage> {
        return new Promise<IDataPage>((resolve, reject) => {
            const page = this.data.find((element: IDataPage) => {
                return id === element.page_id;
            });
            if (page === undefined) {
                reject(`Page '${id}' cannot be found`);
            }
            resolve(page);
        });
    }

    /**
     * Get translated page with infos
     * @param {string} pageId
     * @param {string} lang
     * @returns {Promise<IDataPageWithMedia>}
     */
    async getPageWithMedias(pageId: string, lang: string): Promise<IDataPageWithMedia> {
        return new Promise<IDataPageWithMedia>((resolve, reject) => {
            const page = this.data.find((element: IDataPage) => {
                return pageId === element.page_id;
            });
            if (page === undefined) {
                reject(`Page '${pageId}' cannot be found`);
            }
            const { content } = page as IDataPage;

            const videos: IDataPageVideoEntity[] = [];
            let audio: any;
            let subtitle: any;

            // Step 1: select video(s)
            content.videos.forEach(video => {
                let v = <IDataPageVideoEntity>video;
                if ((<IDataPageLocalizedVideoEntity>video).i18n === true) {
                    v = (<IDataPageLocalizedVideoEntity>video).versions[lang];
                }
                videos.push(v);
            });

            // Step 2: select audio track
            if (content.audio !== undefined) {
                const { src: audioSrc } = content.audio;
                if (typeof audioSrc === 'string') {
                    audio = content.audio;
                } else if ((<IDataPageLocalizedAudioSource>audioSrc).versions[lang] !== undefined) {
                    audio = audioSrc.versions[lang];
                }
                // Step 3: select audio subtitles
                if (content.audio.tracks !== undefined) {
                    subtitle = content.audio.tracks[lang];
                }
            }

            const p = {
                ...page,
                videos: videos,
                audio: audio,
                subtitle: subtitle,
            } as IDataPageWithMedia;

            resolve(p);
        });
    }
}

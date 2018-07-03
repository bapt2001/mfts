import React from 'react';
import './page.scss';

import PageEntity from '@src/models/entity/page-entity';

import ControlBar from '@src/shared/player/controls/control-bar';
import PanelMultiVideo from '@src/components/panel-multi-video';
import AudioPlayer from '@src/components/player/audio-player';
import VideoPlayer from '@src/components/player/video-player';
import { PlayerActions } from '@src/shared/player/player';
import ControlBarOverlay from '@src/shared/player/controls/control-bar-overlay';
import { ReactPlayerProps } from 'react-player';

export type PlaybackState = {
    currentTime: number;
    isPlaying: boolean;
    duration: number;
    videoWidth: number;
    videoHeight: number;
    playbackRate: number;
    isMetadataLoaded: boolean;
};

export type PageProps = {
    pageEntity: PageEntity;
    lang: string;
};

export type PageState = {
    playbackState: PlaybackState;
};

const defaultPlaybackState: PlaybackState = {
    currentTime: 0,
    isPlaying: true,
    duration: 0,
    playbackRate: 1,
    videoWidth: 0,
    videoHeight: 0,
    isMetadataLoaded: false,
};

export default class Page extends React.Component<PageProps, PageState> {
    readonly state: PageState;

    videoPlayerRef!: React.RefObject<VideoPlayer>;
    audioPlayerRef!: React.RefObject<AudioPlayer>;

    mainPlayerListeners!: Partial<ReactPlayerProps>;

    mediaPlayerActions!: PlayerActions;

    constructor(props: PageProps) {
        super(props);

        const playerInitialState: PlaybackState = defaultPlaybackState;

        this.state = {
            playbackState: playerInitialState,
        };

        this.initPlayerListeners();
        this.initMediaPlayerActions();

        this.videoPlayerRef = React.createRef<VideoPlayer>();
        this.audioPlayerRef = React.createRef<AudioPlayer>();
    }

    render() {
        const { pageEntity: page } = this.props;

        const countVideos = page.countVideos();
        const multiVideoLayout = countVideos > 1;

        const videos = page.getVideos(this.props.lang);
        const audio = page.getAudioEntity();

        return (
            <div className="page-container">
                <div className="page-header">
                    Page: {page.pageId}
                    Playing <input id="playing" type={'checkbox'} checked={this.state.playbackState.isPlaying} />
                    Loading <input id="loading" type={'checkbox'} />
                </div>

                <div className="page-content">
                    {multiVideoLayout ? (
                        <div className="page-multi-video-layout">
                            <PanelMultiVideo
                                videos={videos}
                                pageEntity={page}
                                playing={this.state.playbackState.isPlaying}
                                playbackRate={this.state.playbackState.playbackRate}
                            />

                            {audio && (
                                <div className="panel-audio-subs">
                                    <AudioPlayer
                                        ref={this.audioPlayerRef}
                                        activeSubtitleLang={this.props.lang}
                                        audio={audio}
                                        playing={this.state.playbackState.isPlaying}
                                        preload="preload"
                                        width="100%"
                                        height="100%"
                                        {...this.mainPlayerListeners}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="page-single-video-layout">
                            <div
                                className="autoscale-video-container"
                                onClick={() => {
                                    this.mediaPlayerActions.play();
                                }}
                            >
                                <VideoPlayer
                                    ref={this.videoPlayerRef}
                                    className="autoscale-video-wrapper autoscale-video-content"
                                    crossOrigin={'anonymous'}
                                    activeSubtitleLang={this.props.lang}
                                    style={{}}
                                    preload="preload"
                                    video={page.getFirstVideo()!}
                                    playing={this.state.playbackState.isPlaying}
                                    playbackRate={this.state.playbackState.playbackRate}
                                    width="100%"
                                    height="100%"
                                    {...this.mainPlayerListeners}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {/*
                <div className="page-footer">
                </div>
                */}

                <ControlBar
                    {...(this.getMainPlayerVideoElement() ? { videoEl: this.getMainPlayerVideoElement()! } : {})}
                    actions={this.mediaPlayerActions}
                    duration={this.state.playbackState.duration}
                    currentTime={this.state.playbackState.currentTime}
                    isPlaying={this.state.playbackState.isPlaying}
                    playbackRate={this.state.playbackState.playbackRate}
                />
            </div>
        );
    }

    /**
     * Return the main player media player (audio/video)
     * @returns {HTMLVideoElement | null}
     */
    protected getMainPlayerVideoElement(): HTMLVideoElement | null {
        let videoEl: HTMLVideoElement | null = null;
        if (this.audioPlayerRef.current) {
            videoEl = this.audioPlayerRef.current.getHTMLVideoElement();
        } else if (this.videoPlayerRef.current) {
            videoEl = this.videoPlayerRef.current.getHTMLVideoElement();
        }
        return videoEl;
    }

    protected initPlayerListeners(): void {
        this.mainPlayerListeners = {
            onPlay: () => {
                this.updatePlaybackState({
                    isPlaying: true,
                });
            },
            onEnded: () => {},
            onError: () => {},
            onReady: () => {},
            onPause: () => {
                this.updatePlaybackState({
                    isPlaying: false,
                });
            },
            onDuration: (duration: number) => {
                this.updatePlaybackState({
                    duration: duration,
                });
            },
        };
    }

    protected initMediaPlayerActions(): void {
        this.mediaPlayerActions = {
            // Actions
            pause: () => {
                this.setState((prevState, prevProps) => {
                    const newState = {
                        prevState,
                        ...{ playbackState: { ...prevState.playbackState, isPlaying: false } },
                    };
                    return newState;
                });
            },
            play: () => {
                this.setState((prevState, prevProps) => {
                    const newState = {
                        prevState,
                        ...{ playbackState: { ...prevState.playbackState, isPlaying: true } },
                    };
                    return newState;
                });
            },
            setPlaybackRate: playbackRate => {
                this.setState((prevState, prevProps) => {
                    const newState = {
                        prevState,
                        ...{ playbackState: { ...prevState.playbackState, playbackRate: playbackRate } },
                    };
                    return newState;
                });
            },

            setCurrentTime: time => {
                console.log('set current time');
                const videoEl = this.getMainPlayerVideoElement();
                if (videoEl) {
                    videoEl.currentTime = time;
                }
            },
        };
    }

    private updatePlaybackState(deltaState: Partial<PlaybackState>): void {
        this.setState((prevState: PageState) => {
            return { ...prevState, playbackState: { ...prevState.playbackState, ...deltaState } };
        });
    }
}

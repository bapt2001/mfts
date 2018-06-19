import React from 'react';
import './page.scss';

import PageEntity from '@src/models/entity/page-entity';

import ControlBar from '@src/shared/player/controls/control-bar';
import PageVideoGroup from '@src/components/page-video-group';
import AudioPlayer from '@src/components/player/audio-player';
import VideoPlayer from '@src/components/player/video-player';
import { PlayerActions } from '@src/shared/player/player';

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

export default class Page extends React.Component<PageProps, PageState> {
    readonly state: PageState;
    playerRef!: React.RefObject<VideoPlayer>;
    audioPlayer!: React.RefObject<AudioPlayer>;

    mediaPlayerActions!: PlayerActions;

    constructor(props: PageProps) {
        super(props);

        const playerInitialState: PlaybackState = {
            currentTime: 0,
            isPlaying: true,
            duration: 0,
            playbackRate: 1,
            videoWidth: 0,
            videoHeight: 0,
            isMetadataLoaded: false,
        };

        this.state = {
            playbackState: playerInitialState,
        };

        this.initMediaPlayerActions();

        this.playerRef = React.createRef<VideoPlayer>();
        this.audioPlayer = React.createRef<AudioPlayer>();
    }

    render() {
        const { pageEntity: page } = this.props;

        const videos = page.getVideos(this.props.lang);
        const audio = page.getAudioEntity();

        // Warning this is an hack...
        // - audio/mp3 works on desktops but not on mobile
        // - video/mp4 works on desktops
        const audioMimeType = 'video/mp4';

        return (
            <div className="page-container">
                <div className="page-header">Page: {page.pageId}</div>
                <div className="page-content">
                    {page.countVideos() > 1 ? (
                        <div className="page-multi-video-layout">
                            <PageVideoGroup
                                videos={videos}
                                pageEntity={page}
                                playbackState={{
                                    playing: this.state.playbackState.isPlaying,
                                    playbackRate: this.state.playbackState.playbackRate,
                                }}
                            />

                            {audio && (
                                <div className="page-audio-subs">
                                    <AudioPlayer
                                        ref={this.audioPlayer}
                                        activeSubtitleLang={this.props.lang}
                                        audio={audio}
                                        playing={this.state.playbackState.isPlaying}
                                        preload="preload"
                                        onPlay={() => {
                                            this.updatePlaybackState({
                                                isPlaying: true,
                                            });
                                        }}
                                        onPause={() => {
                                            this.updatePlaybackState({
                                                isPlaying: false,
                                            });
                                        }}
                                        onDuration={(duration: number) => {
                                            this.updatePlaybackState({
                                                duration: duration,
                                            });
                                        }}
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="page-single-video-layout">
                            <div className="autoscale-video-container">
                                {/*
                                <div className="autoscale-video-wrapper autoscale-video-content">
                                    <video src={player.getFirstVideo()!.getSources()[0].getSource()}
                                           controls />
                                </div>
                                */}
                                <VideoPlayer
                                    ref={this.playerRef}
                                    className="autoscale-video-wrapper autoscale-video-content"
                                    crossOrigin={'anonymous'}
                                    activeSubtitleLang={this.props.lang}
                                    style={{}}
                                    preload="preload"
                                    video={page.getFirstVideo()!}
                                    playing={this.state.playbackState.isPlaying}
                                    onPlay={() => {
                                        this.updatePlaybackState({
                                            isPlaying: true,
                                        });
                                    }}
                                    onPause={() => {
                                        this.updatePlaybackState({
                                            isPlaying: false,
                                        });
                                    }}
                                    onDuration={(duration: number) => {
                                        this.updatePlaybackState({
                                            duration: duration,
                                        });
                                    }}
                                    width="100%"
                                    height="100%"
                                />
                            </div>

                            {/*
                            <PageVideoPlayer
                                className="autoscale-video-wrapper autoscale-video-content"
                                ref={this.playerRef}
                                video={player.getFirstVideo()!}
                                playing={this.state.playbackState.isPlaying}
                                onPlay={() => {
                                    this.updatePlaybackState({
                                        isPlaying: true,
                                    });
                                }}
                                onPause={() => {
                                    this.updatePlaybackState({
                                        isPlaying: false,
                                    });
                                }}
                                onDuration={(duration: number) => {
                                    this.updatePlaybackState({
                                        duration: duration,
                                    });
                                }}
                                width="auto"
                                height="auto"
                            />
                            */}
                        </div>
                    )}
                </div>
                <div className="page-footer">
                    <ControlBar
                        {...(this.getMainPlayerVideoElement() ? { videoEl: this.getMainPlayerVideoElement()! } : {})}
                        actions={this.mediaPlayerActions}
                        duration={this.state.playbackState.duration}
                        currentTime={this.state.playbackState.currentTime}
                        isPlaying={this.state.playbackState.isPlaying}
                        playbackRate={this.state.playbackState.playbackRate}
                    />
                </div>
            </div>
        );
    }

    /**
     * Return the main player media player (audio/video)
     * @returns {HTMLVideoElement | null}
     */
    private getMainPlayerVideoElement(): HTMLVideoElement | null {
        let videoEl: HTMLVideoElement | null = null;
        if (this.audioPlayer.current) {
            videoEl = this.audioPlayer.current.getHTMLVideoElement();
        } else if (this.playerRef.current) {
            videoEl = this.playerRef.current.getHTMLVideoElement();
        }
        return videoEl;
    }

    private initMediaPlayerActions(): void {
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

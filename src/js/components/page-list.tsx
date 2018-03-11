import * as React from 'react';
import './page-list.scss';
import {IDataPage, VideoOrEnOrFrOrVideosEntity1} from "@data/data-pages";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {IDataVideo} from "@data/data-videos";
import dataVideos from '@data/data-videos.json';


interface IProps {
    pages: IDataPage[];
    lang: 'en' | 'fr';
    baseUrl: string;
    onSelected?: (page: IDataPage) => void;
}

interface IState {

}

export default class PageList extends React.Component<IProps, IState> {

    handlePageClick(page: IDataPage) {
        //alert('page selected:' + page.id);
    }

    protected getVideo(video_id: string): IDataVideo {

        return dataVideos.filter((video: IDataVideo) => {
            return video.video_id === video_id;
        });
    }

    render() {
        const list = this.props.pages;
        //const {baseUrl, onSelected} = this.props;

        console.log('pages', list);

        const Animate = ({ children, ...props }) => (
            <CSSTransition
                {...props}
                enter={true}
                appear={true}
                exit={false}
                timeout={1000}
                classNames="fade"
            >
                {children}
            </CSSTransition>
        );


        const toc = this.getTocComponent(list);
        const baseUrl = this.props.baseUrl;
        return (
            <div>

                <div className="page-list-wrapper">

                    <TransitionGroup className="grid-cards">
                        { list && list.map((page) => {
                            const {id, content} = page;

                            let videos: IDataVideo[] = [];
                            switch (content.layout) {
                                case 'single-video':
                                case 'single-video-audio':
                                    videos[0] = this.getVideo((content.video as any).video_id)[0];
                                    break;
                                case 'single-i18n-video':
                                    videos[0] = this.getVideo((content.video_i18n as any)[this.props.lang].video_id)[0];
                                    break;
                                case 'two-videos-only':
                                case 'three-videos-only':
                                case 'three-videos-audio-subs':
                                case 'four-videos-audio-subs':
                                    videos = (content.videos as VideoOrEnOrFrOrVideosEntity1[]).map((video) => {
                                        return this.getVideo(video.video_id)[0];
                                    });

                                    break;
                                default:
                                    alert('error ' + content.layout + id);
                            }

                            const coverImg = baseUrl + 'covers/' + videos[0].video_id + '-02.jpg';
                            return (
                                <Animate key={id}>
                                    <div className="card"
                                         style={{backgroundImage: `url(${coverImg})`}} key={id} >
                                        <h2>{id}</h2>
                                        <div className="grid-page-thumbnail">
                                        {videos.map((video) => {
                                            const videoCover = baseUrl + 'covers/' + video.video_id + '-01.jpg';
                                            return(
                                                <div>
                                                    <img src={videoCover} title={video.video_id} />
                                                    <p>{video.meta.duration}</p>
                                                </div>

                                            )
                                        })}
                                        </div>

                                    </div>
                                </Animate>
                            );
                        })}

                    </TransitionGroup>

                </div>


                <div>
                    <h2>Table of contents</h2>
                    {toc}

                </div>

            </div>
        );
    }

    protected getTocComponent(list: IDataPage[]): JSX.Element {
        return (
            <table>
                <thead>
                <tr>
                    <td></td>
                    <td>Title</td>
                    <td>Layout</td>
                </tr>
                </thead>
                <tbody>
                {list.map((page: IDataPage, idx: number) => (
                    <tr key={page.id}>
                        <td>{idx + 1}</td>
                        <td onClick={e => {this.handlePageClick(page)}}>{page.title[this.props.lang]}</td>
                        <td>{page.content.layout}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        );

    }

}
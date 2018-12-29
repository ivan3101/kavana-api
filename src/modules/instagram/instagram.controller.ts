import {bind} from "decko";
import {Request, Response, NextFunction} from "express";
import Axios from "axios";


export class InstagramController {

    @bind
    async getLastPosts(req: Request, res: Response, next: NextFunction): Promise<any> {
        const kavanaInfo = await Axios.get("https://www.instagram.com/kavanarevest/");

        const jsonObject = JSON.parse(kavanaInfo.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1));

        const mediaArray = jsonObject.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(0, 20);

        const images = [];
        let i = 0;

        while (images.length < 6) {
            const node = mediaArray[i].node;
            i++;
            
            if ((node.__typename && node.__typename !== 'GraphImage')) {
                continue
            }

            images.push({
                description: node.edge_media_to_caption.edges[0].node.text,
                image: node.thumbnail_src,
                url: `https://instagram.com/p/${node.shortcode}`
            })
        }

        res
            .status(200)
            .json({
                images
            })
    }
}
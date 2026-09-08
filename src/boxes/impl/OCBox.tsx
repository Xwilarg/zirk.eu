import GenericBox from "../GenericBox";
import type { OCInfo } from "../../models/OC";
import { useState } from "react";
import type { Button } from "../../models/Button";
import { isNsfw } from "../../utils";
import type { ImagePreviewInfo } from "../../components/modal/ImageGroupModalForm";

interface OCItemFormProps
{
    item: OCInfo,
    setPreview: (images: ImagePreviewInfo[]) => void
}

export default function OCBox({ item, setPreview }: OCItemFormProps)
{
    const [tabShown, setTabShown] = useState(0);

    const category = item.images.find(x => x.default)!;
    const image = category.images.find(x => x.default)!;

    const nsfw = isNsfw();

    let buttons: Button[] = [
        {
            color: "Default",
            label: "info",
            labelType: "GoogleIcon",
            type: "Custom",
            action: () => { setTabShown(x => x === 0 ? 1 : 0) }
        },
        {
            color: "Default",
            label: "image",
            labelType: "GoogleIcon",
            type: "Custom",
            action: () => { setTabShown(x => x === 0 ? 2 : 0) }
        },
        {
            color: "Default",
            label: "joystick",
            labelType: "GoogleIcon",
            type: "Custom",
            action: () => { setTabShown(x => x === 0 ? 3 : 0) },
            disabled: item.metadata.media.length === 0
        }
    ];
    
    if (tabShown === 1) {
        return <GenericBox key={item.name} name={item.name} nsfw={false}
            icons={[{
                icon: "globe",
                label: item.metadata.location
            }, {
                icon: "transgender",
                label: item.metadata.gender
            }, {
                icon: "height",
                label: (item.metadata.height / 100).toFixed(2) + "m"
            }, {
                icon: "explicit",
                label: item.metadata.orientation
            }, {
                icon: "person",
                label: item.metadata.species
            }, {
                icon: "visibility",
                label: item.metadata.power ?? ""
            }]}
            buttons={buttons}
        ></GenericBox>
    }
    if (tabShown === 2) {
        return <GenericBox key={item.name} name={item.name} nsfw={false}
            custom={<div className="is-flex flex-center-hor">
                {
                    item.images.filter(x => !x.hide && (nsfw !== "FullSFW" || !x.images.find(x => x.default)!.nsfw))
                    .sort((a, b) => new Date(b.date ?? "1970-01-01").getTime() - new Date(a.date ?? "1970-01-01").getTime())
                    .map(x => {
                        const def = x.images.find(x => x.default)!;
                        const isBlurry = nsfw === "SFW" && def.nsfw;

                        if (isBlurry) {
                            return <div className="card-img gallery-img">
                                <img src={`/data/previews/ocs/${item.metadata.folder}/${def.link}`} className="blur" />
                            </div>
                        }
                        if (def.link.endsWith("mp4")) {
                            return <div className="card-img gallery-img">
                                <video src={`/data/previews/ocs/${item.metadata.folder}/${def.link}`}
                                onClick={() => setPreview(x.images.filter(x => nsfw !== "FullSFW" || !x.nsfw).map(x => ({ image: `/data/img/ocs/${item.metadata.folder}/${x.link}`, nsfw: x.nsfw })))} />
                            </div>
                        }
                        return <div className="card-img gallery-img">
                            <img src={`/data/previews/ocs/${item.metadata.folder}/${def.link}`} className={category?.type === "pixel" ? "pixel" : ""}
                            onClick={() => setPreview(x.images.filter(x => nsfw !== "FullSFW" || !x.nsfw).map(x => ({ image: `/data/img/ocs/${item.metadata.folder}/${x.link}`, nsfw: x.nsfw })))} />
                        </div>
                    })
                }
            </div>}
            buttons={buttons}
        ></GenericBox>
    }
    if (tabShown === 3) {
        return <GenericBox key={item.name} name={item.name} nsfw={false}
            custom={<div className="is-flex flex-center-hor">
                {
                    item.metadata.media.filter(x => nsfw !== "FullSFW" || !x.nsfw)
                    .map(x => {
                        const isBlurry = nsfw === "SFW" && x.nsfw;

                        if (isBlurry) {
                            return <div className="card-img gallery-img">
                                <img src={x.image} className="blur" />
                            </div>
                        }
                        return <div className="card-img gallery-img">
                            <img src={x.image} />
                        </div>
                    })
                }
            </div>}
            buttons={buttons}
        ></GenericBox>
    }

    return <GenericBox key={item.name} name={item.name} image={`/data/previews/ocs/${item.metadata.folder}/${image.link}`} nsfw={image.nsfw}
            imageCssModifiers={`top ${category?.type === "pixel" ? "pixel" : ""}`} onClick={() => setPreview(category.images.filter(x => nsfw !== "FullSFW" || !x.nsfw).map(x => ({ image: `/data/img/ocs/${item.metadata.folder}/${x.link}`, nsfw: x.nsfw })))}
            buttons={buttons}
        ></GenericBox>
};
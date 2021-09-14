import './memories.scss'

export const Memories = (props) => {
    let isOverlay = props.overlay;
    if (isOverlay === "false") {
        return (
            <div className="memory">
                <img alt="Card" src={props.img === "" ? "https://picsum.photos/516/354" : props.img} className="mimg"/>
            </div>
        )
    } else {
        return (
            <div className="memory">
                <img alt="Card" src={props.img === "" ? "https://picsum.photos/516/354" : props.img} className="mimg"/>
                <div className="overlay">
                    <h3 className="text">See More</h3>
                </div>
            </div>
        )
    }
}
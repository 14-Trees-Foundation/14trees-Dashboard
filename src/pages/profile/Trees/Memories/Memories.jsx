import './memories.scss'

export const Memories = (props) => {
    let isOverlay = props.overlay;
    if (isOverlay === "false") {
        return (
            <div>
                <img alt="Card" src="https://picsum.photos/536/354" className="memory"/>
            </div>
        )
    } else {
        return (
            <div className="memory">
                <img alt="Card" src="https://picsum.photos/536/354" className="memory"/>
                <div className="overlay">
                    <h3 className="text">See More</h3>
                </div>
            </div>
        )
    }
}
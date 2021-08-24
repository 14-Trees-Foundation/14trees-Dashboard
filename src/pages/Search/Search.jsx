import { InputBar } from "./InputBar/InputBar"
import { Button } from "../../stories/Button/Button"
import bg from "../../assets/bg.png"
import './search.scss'

export const Search = () => {
    return(
        <div className="s-box">
            <img alt="bg" src={bg} className="s-img"/>
            <div className="s-bg">
                <div className="s-input">
                    <div className="s-info">
                        <h1 className="s-header">100+</h1>
                        <p className="s-desc">People employed from local community</p>
                    </div>
                    <InputBar/>
                    <p className="s-sep">OR</p>
                    <div className="s-s-btn">
                        <Button size={"large"} label={"See all the people"}/>
                        <Button size={"large"} label={"See all the events"}/>
                        <Button size={"large"} label={"See all the organization"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
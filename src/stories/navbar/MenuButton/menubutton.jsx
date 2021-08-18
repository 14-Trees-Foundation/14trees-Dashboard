import { Button } from "primereact/button"
import './menubutton.scss'

export const MenuButton = (props) => {
    return (
        <Button className="menu-button">
            {props.label}
        </Button>
    )
}
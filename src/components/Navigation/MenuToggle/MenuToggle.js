import React from "react";
import classes from "./MenuToggle.css";

const MenuToggle = ({onToggle, isOpen}) => {
    const cls = [
        classes.MenuToggle,
        'fa',
        isOpen ? `fa-times ${classes.open}` : 'fa-bars'
    ]

    return (
        <i
            className={cls.join(' ')}
            onClick={onToggle}
        />
    )
}

export default MenuToggle;
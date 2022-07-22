import type { NextPage } from "next";
import { useState } from "react";
import { OrderGroup, OrderItem, defaultTheme, arrayMove } from 'react-draggable-order';

const Test: NextPage = () => {
    const [order, setOrder] = useState([1, 2, 3])

    return (<>
        <OrderGroup {...defaultTheme.group}>
            {order.map((x, i) => {
                return (<OrderItem onMove={(to) => {
                    console.log(to)
                }} index={i} key={i}>
                    <OrderItem.Handle>
                        handle: {x}
                    </OrderItem.Handle>
                </OrderItem>)
            })}
        </OrderGroup>
    </>)
}

export default Test
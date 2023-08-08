import React, {PropsWithChildren} from "react";
import './page-container.scss'

export const PageContainer: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <div className={'page-container'}>
            {children}
        </div>
    );
}

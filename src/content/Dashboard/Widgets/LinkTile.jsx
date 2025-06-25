import React from 'react';
import {
    Tile,
    Grid,
    Column,
    Link,
    TextInput,
} from '@carbon/react';
import { Link as LinkIcon } from '@carbon/icons-react';
import '../Dashboard.scss';
import { UserAvatar } from '@carbon/ibm-products';

const LinkTile = ({ link, title, body, url }) => {
    return (
        <Tile className="border mb-3 shadow-0" style={{ maxWidth: "540px" }}>
            <Grid narrow>
                <Column sm={4} md={4} lg={4}>
                    <UserAvatar
                        src={link}
                        alt="KALKINSO Avatar"
                        className="img-fluid rounded-left"
                    />
                </Column>
                <Column sm={12} md={8} lg={8}>
                    <div style={{ padding: "16px" }}>
                        <p style={{ lineHeight: "1", fontWeight: "bold" }}>
                            {title}
                        </p>
                        <p className="small mb-0" style={{ lineHeight: "1.2" }}>
                            {body}
                        </p>
                        <p className="small mb-0" style={{ lineHeight: "1.2" }}>
                            <LinkIcon size={16} className="pe-1" />
                            <Link href={url}>{url}</Link>
                        </p>
                    </div>
                </Column>
            </Grid>
        </Tile>
    );
}

export default LinkTile;

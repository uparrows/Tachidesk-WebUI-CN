/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { useContext, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { fromEvent } from 'file-selector';
import client from 'util/client';
import makeToast from 'components/util/Toast';
import ListItemLink from '../../components/util/ListItemLink';
import NavbarContext from '../../components/context/NavbarContext';

export default function Backup() {
    const { setTitle, setAction } = useContext(NavbarContext);
    useEffect(() => { setTitle('备份'); setAction(<></>); }, []);

    const { baseURL } = client.defaults;

    const submitBackup = (file: File) => {
        if (file.name.toLowerCase().endsWith('proto.gz')) {
            const formData = new FormData();
            formData.append('backup.proto.gz', file);

            makeToast('恢复备份....', 'info');
            client.post('/api/v1/backup/import/file',
                formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(() => makeToast('备份还原完成!', 'success'))
                .catch(() => makeToast('备份还原失败!', 'error'));
        } else if (file.name.toLowerCase().endsWith('json')) {
            makeToast('不支持旧版备份!', 'error');
        } else {
            makeToast('文件类型无效!', 'error');
        }
    };

    const dropHandler = async (e: Event) => {
        e.preventDefault();
        const files = await fromEvent(e);

        submitBackup(files[0] as File);
    };

    const dragOverHandler = (e: Event) => {
        e.preventDefault();
    };

    useEffect(() => {
        document.addEventListener('drop', dropHandler);
        document.addEventListener('dragover', dragOverHandler);

        const input = document.getElementById('backup-file');
        input?.addEventListener('change', async (evt) => {
            const files = await fromEvent(evt);
            submitBackup(files[0] as File);
        });

        return () => {
            document.removeEventListener('drop', dropHandler);
            document.removeEventListener('dragover', dragOverHandler);
        };
    }, []);

    return (
        <>
            <List sx={{ padding: 0 }}>
                <ListItemLink to={`${baseURL}/api/v1/backup/export/file`} directLink>
                    <ListItemText
                        primary="创建备份"
                        secondary="创建一个Tachiyomi的资源库备份"
                    />
                </ListItemLink>
                <ListItem button onClick={() => document.getElementById('backup-file')?.click()}>
                    <ListItemText
                        primary="恢复备份"
                        secondary="您也可以将备份文件拖放到此处进行恢复"
                    />
                </ListItem>
            </List>
            <input
                type="file"
                id="backup-file"
                style={{ display: 'none' }}
            />
        </>

    );
}

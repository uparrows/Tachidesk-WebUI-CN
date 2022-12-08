/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { FormLabel, RadioGroup } from '@mui/material';
import CheckboxInput from 'components/atoms/CheckboxInput';
import RadioInput from 'components/atoms/RadioInput';
import SortRadioInput from 'components/atoms/SortRadioInput';
import ThreeStateCheckboxInput from 'components/atoms/ThreeStateCheckboxInput';
import { useLibraryOptionsContext } from 'components/context/LibraryOptionsContext';
import OptionsTabs from 'components/molecules/OptionsTabs';
import React from 'react';

const TITLES = {
    filter: '筛选',
    sort: '排序',
    display: '显示',
};

const SORT_OPTIONS: [LibrarySortMode, string][] = [
    ['sortToRead', '按未读章节'],
    ['sortAlph', '按字母顺序'],
    ['sortID', '按文件ID'],
];

interface IProps {
    open: boolean,
    onClose: () => void,
}

const LibraryOptionsPanel: React.FC<IProps> = ({ open, onClose }) => {
    const { options, setOptions } = useLibraryOptionsContext();

    const handleFilterChange = <T extends keyof LibraryOptions>(
        key: T,
        value: LibraryOptions[T],
    ) => {
        setOptions((v) => ({ ...v, [key]: value }));
    };

    return (
        <OptionsTabs<'filter' | 'sort' | 'display'>
            open={open}
            onClose={onClose}
            tabs={['filter', 'sort', 'display']}
            tabTitle={(key) => TITLES[key]}
            tabContent={(key) => {
                if (key === 'filter') {
                    return (
                        <>
                            <ThreeStateCheckboxInput label="未读" checked={options.unread} onChange={(c) => handleFilterChange('unread', c)} />
                            <ThreeStateCheckboxInput label="已下载" checked={options.downloaded} onChange={(c) => handleFilterChange('downloaded', c)} />
                        </>
                    );
                }
                if (key === 'sort') {
                    return SORT_OPTIONS.map(([mode, label]) => (
                        <SortRadioInput
                            key={mode}
                            label={label}
                            checked={options.sorts === mode}
                            sortDescending={options.sortDesc}
                            onClick={() => (mode !== options.sorts
                                ? handleFilterChange('sorts', mode)
                                : handleFilterChange('sortDesc', !options.sortDesc))}
                        />
                    ));
                }
                if (key === 'display') {
                    const { gridLayout, showDownloadBadge, showUnreadBadge } = options;
                    return (
                        <>
                            <FormLabel>显示模式</FormLabel>
                            <RadioGroup
                                onChange={(e) => handleFilterChange('gridLayout', Number(e.target.value))}
                                value={gridLayout}
                            >
                                <RadioInput label="紧凑网格" value={0} checked={gridLayout == null || gridLayout === 0} />
                                <RadioInput label="宽松网格" value={1} checked={gridLayout === 1} />
                                <RadioInput label="列表" value={2} checked={gridLayout === 2} />
                            </RadioGroup>

                            <FormLabel sx={{ mt: 2 }}>标签</FormLabel>
                            <CheckboxInput
                                label="未读标签"
                                checked={showUnreadBadge === true}
                                onChange={() => handleFilterChange('showUnreadBadge', !showUnreadBadge)}
                            />
                            <CheckboxInput
                                label="下载标签"
                                checked={showDownloadBadge === true}
                                onChange={() => handleFilterChange('showDownloadBadge', !showDownloadBadge)}
                            />
                        </>
                    );
                }
                return null;
            }}
        />
    );
};

export default LibraryOptionsPanel;

/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { RadioGroup } from '@mui/material';
import RadioInput from 'components/atoms/RadioInput';
import SortRadioInput from 'components/atoms/SortRadioInput';
import ThreeStateCheckboxInput from 'components/atoms/ThreeStateCheckboxInput';
import OptionsTabs from 'components/molecules/OptionsTabs';
import React from 'react';
import { SORT_OPTIONS } from './util';

interface IProps {
    open: boolean
    onClose: () => void
    options: ChapterListOptions
    optionsDispatch: React.Dispatch<ChapterOptionsReducerAction>
}

const TITLES = {
    filter: '筛选',
    sort: '排序',
    display: '显示',
};

const ChapterOptions: React.FC<IProps> = ({
    open, onClose, options, optionsDispatch,
}) => (
    <OptionsTabs<'filter' | 'sort' | 'display'>
        open={open}
        onClose={onClose}
        minHeight={150}
        tabs={['filter', 'sort', 'display']}
        tabTitle={(key) => TITLES[key]}
        tabContent={(key) => {
            if (key === 'filter') {
                return (
                    <>
                        <ThreeStateCheckboxInput label="未读" checked={options.unread} onChange={(c) => optionsDispatch({ type: 'filter', filterType: 'unread', filterValue: c })} />
                        <ThreeStateCheckboxInput label="已下载" checked={options.downloaded} onChange={(c) => optionsDispatch({ type: 'filter', filterType: 'downloaded', filterValue: c })} />
                        <ThreeStateCheckboxInput label="已加书签" checked={options.bookmarked} onChange={(c) => optionsDispatch({ type: 'filter', filterType: 'bookmarked', filterValue: c })} />
                    </>
                );
            }
            if (key === 'sort') {
                return SORT_OPTIONS.map(([mode, label]) => (
                    <SortRadioInput
                        key={mode}
                        label={label}
                        checked={options.sortBy === mode}
                        sortDescending={options.reverse}
                        onClick={() => (mode !== options.sortBy
                            ? optionsDispatch({ type: 'sortBy', sortBy: mode })
                            : optionsDispatch({ type: 'sortReverse' }))}
                    />
                ));
            }
            if (key === 'display') {
                return (
                    <RadioGroup onChange={() => optionsDispatch({ type: 'showChapterNumber' })} value={options.showChapterNumber}>
                        <RadioInput label="资源标题" value={false} />
                        <RadioInput label="章节编号" value />
                    </RadioGroup>
                );
            }
            return null;
        }}
    />
);

export default ChapterOptions;

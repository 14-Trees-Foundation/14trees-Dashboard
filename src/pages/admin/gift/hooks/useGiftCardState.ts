import { useState } from 'react';
import { GiftCard } from '../../../../types/gift_card';
import { Plot } from '../../../../types/plot';
import { GridFilterItem } from '@mui/x-data-grid';
import { Order } from '../../../../types/common';

export const useGiftCardState = () => {
    // Modal states
    const [changeMode, setChangeMode] = useState<'add' | 'edit'>('add');
    const [step, setStep] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [plotModal, setPlotModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [autoAssignModal, setAutoAssignModal] = useState(false);
    const [emailConfirmationModal, setEmailConfirmationModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [notesModal, setNotesModal] = useState(false);
    const [albumImagesModal, setAlbumImagesModal] = useState(false);
    const [userDetailsEditModal, setUserDetailsEditModal] = useState(false);
    const [tagModal, setTagModal] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [autoPrsConfirm, setPrsConfirm] = useState(false);
    const [giftCardNotification, setGiftCardNotification] = useState(false);

    // Data states
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
    const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
    const [selectedTrees, setSelectedTrees] = useState<any[]>([]);
    const [selectedPaymentGR, setSelectedPaymentGR] = useState<GiftCard | null>(null);
    const [selectedGiftRequestIds, setSelectedGiftRequestIds] = useState<number[]>([]);
    const [album, setAlbum] = useState<any>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [requestId, setRequestId] = useState<string | null>(null);

    // Table states
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [tableRows, setTableRows] = useState<GiftCard[]>([]);

    // Configuration states
    const [bookNonGiftable, setBookNonGiftable] = useState(false);
    const [diversify, setDiversify] = useState(false);
    const [bookAllHabits, setBookAllHabits] = useState(false);

    // Loading states
    const [savingChange, setSavingChange] = useState(false);
    const [testingMail, setTestingMail] = useState(false);
    const [autoProcessing, setAutoProcessing] = useState(false);

    // Chart states
    const [corporateCount, setCorporateCount] = useState(0);
    const [personalCount, setPersonalCount] = useState(0);

    return {
        // Modal states
        changeMode, setChangeMode,
        step, setStep,
        modalOpen, setModalOpen,
        plotModal, setPlotModal,
        infoModal, setInfoModal,
        autoAssignModal, setAutoAssignModal,
        emailConfirmationModal, setEmailConfirmationModal,
        deleteModal, setDeleteModal,
        notesModal, setNotesModal,
        albumImagesModal, setAlbumImagesModal,
        userDetailsEditModal, setUserDetailsEditModal,
        tagModal, setTagModal,
        paymentModal, setPaymentModal,
        autoPrsConfirm, setPrsConfirm,
        giftCardNotification, setGiftCardNotification,

        // Data states
        selectedGiftCard, setSelectedGiftCard,
        selectedPlots, setSelectedPlots,
        selectedTrees, setSelectedTrees,
        selectedPaymentGR, setSelectedPaymentGR,
        selectedGiftRequestIds, setSelectedGiftRequestIds,
        album, setAlbum,
        tags, setTags,
        requestId, setRequestId,

        // Table states
        page, setPage,
        pageSize, setPageSize,
        filters, setFilters,
        orderBy, setOrderBy,
        tableRows, setTableRows,

        // Configuration states
        bookNonGiftable, setBookNonGiftable,
        diversify, setDiversify,
        bookAllHabits, setBookAllHabits,

        // Loading states
        savingChange, setSavingChange,
        testingMail, setTestingMail,
        autoProcessing, setAutoProcessing,

        // Chart states
        corporateCount, setCorporateCount,
        personalCount, setPersonalCount,
    };
};
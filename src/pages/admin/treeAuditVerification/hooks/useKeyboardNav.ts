import { useEffect } from 'react';

interface UseKeyboardNavParams {
	enabled?: boolean;
	currentSaplingId: string;
	onNext: () => void;
	onPrev: () => void;
	onBatchSave: () => void;
	onReject: () => void;
	onToggleFullscreen: () => void;
	onPageNext: () => void;
	onPagePrev: () => void;
}

export const useKeyboardNav = ({
	enabled = true,
	currentSaplingId,
	onNext,
	onPrev,
	onBatchSave,
	onReject,
	onToggleFullscreen,
	onPageNext,
	onPagePrev,
}: UseKeyboardNavParams) => {
	useEffect(() => {
		if (!enabled) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const isEditable =
				target?.tagName === 'INPUT' ||
				target?.tagName === 'TEXTAREA' ||
				target?.getAttribute('contenteditable') === 'true';

			if (e.ctrlKey && e.key === 'Enter') {
				e.preventDefault();
				onBatchSave();
				return;
			}

			if (e.key === 'Enter' && isEditable && currentSaplingId.trim()) {
				e.preventDefault();
				onNext();
				return;
			}

			if (e.key === 'Escape') {
				e.preventDefault();
				onToggleFullscreen();
				return;
			}

			if (isEditable) {
				if (e.key === 'PageDown') {
					e.preventDefault();
					onPageNext();
				}
				if (e.key === 'PageUp') {
					e.preventDefault();
					onPagePrev();
				}
				return;
			}

			if (e.key === 'ArrowRight') {
				e.preventDefault();
				onNext();
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				onPrev();
			} else if (e.key === 'PageDown') {
				e.preventDefault();
				onPageNext();
			} else if (e.key === 'PageUp') {
				e.preventDefault();
				onPagePrev();
			} else if (e.key.toLowerCase() === 'r') {
				e.preventDefault();
				onReject();
			} else if (e.key.toLowerCase() === 'f') {
				e.preventDefault();
				onToggleFullscreen();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [
		enabled,
		currentSaplingId,
		onNext,
		onPrev,
		onBatchSave,
		onReject,
		onToggleFullscreen,
		onPageNext,
		onPagePrev,
	]);
};

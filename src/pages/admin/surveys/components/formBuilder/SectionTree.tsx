import React, { useState, useMemo } from 'react';
import {
	Box,
	Typography,
	IconButton,
	TextField,
	Tooltip,
	Collapse,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArticleIcon from '@mui/icons-material/Article';
import LockIcon from '@mui/icons-material/Lock';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import SearchIcon from '@mui/icons-material/Search';
import {
	TreeNode,
	SelectedItem,
	FormStructure,
	BuilderError,
	buildTree,
} from './formBuilderTypes';

interface SectionTreeProps {
	formStructure: FormStructure;
	selectedItem: SelectedItem | null;
	errors: BuilderError[];
	onSelectItem: (item: SelectedItem) => void;
}

const FIELD_ICONS: Record<string, React.ReactNode> = {
	text: <TextFieldsIcon sx={{ fontSize: 14 }} />,
	number: <NumbersIcon sx={{ fontSize: 14 }} />,
	decimal: <NumbersIcon sx={{ fontSize: 14 }} />,
	select_one: <ArrowDropDownCircleIcon sx={{ fontSize: 14 }} />,
	select_many: <CheckBoxIcon sx={{ fontSize: 14 }} />,
	geopoint: <MyLocationIcon sx={{ fontSize: 14 }} />,
	image: <PhotoCameraIcon sx={{ fontSize: 14 }} />,
	date: <CalendarTodayIcon sx={{ fontSize: 14 }} />,
};

function getFieldIcon(type?: string): React.ReactNode {
	return type ? (
		FIELD_ICONS[type] ?? <DescriptionIcon sx={{ fontSize: 14 }} />
	) : (
		<DescriptionIcon sx={{ fontSize: 14 }} />
	);
}

function getSelectedId(item: SelectedItem | null): string | null {
	if (!item) return null;
	if (item.type === 'section') return `section-${item.id}`;
	if (item.type === 'field') return `field-${item.name}`;
	return null;
}

const SectionTree: React.FC<SectionTreeProps> = ({
	formStructure,
	selectedItem,
	errors,
	onSelectItem,
}) => {
	const [search, setSearch] = useState('');
	const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

	const tree = useMemo(() => buildTree(formStructure), [formStructure]);

	const errorMap = useMemo(() => {
		const m = new Map<string, string[]>();
		for (const e of errors) {
			const key = e.itemId.startsWith('section-')
				? e.itemId
				: `field-${e.itemId}`;
			if (!m.has(key)) m.set(key, []);
			m.get(key)!.push(e.message);
		}
		return m;
	}, [errors]);

	const selectedId = getSelectedId(selectedItem);

	const toggleCollapse = (id: string) => {
		setCollapsed((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const expandAll = () => setCollapsed(new Set());
	const collapseAll = () => {
		const ids = new Set<string>();
		const collect = (nodes: TreeNode[]) => {
			for (const n of nodes) {
				if (n.type !== 'field') ids.add(n.id);
				if (n.children) collect(n.children);
			}
		};
		collect(tree);
		setCollapsed(ids);
	};

	const filterTree = (nodes: TreeNode[], q: string): TreeNode[] => {
		if (!q) return nodes;
		const lq = q.toLowerCase();
		const filter = (ns: TreeNode[]): TreeNode[] =>
			ns.flatMap((n) => {
				if (n.type === 'field') {
					return n.label.toLowerCase().includes(lq) ||
						n.id.toLowerCase().includes(lq)
						? [n]
						: [];
				}
				const filteredChildren = filter(n.children || []);
				if (filteredChildren.length > 0 || n.label.toLowerCase().includes(lq)) {
					return [{ ...n, children: filteredChildren }];
				}
				return [];
			});
		return filter(nodes);
	};

	const visibleTree = filterTree(tree, search);

	const handleNodeClick = (node: TreeNode) => {
		if (node.type === 'field') {
			onSelectItem({ type: 'field', name: node.id.replace('field-', '') });
		} else if (node.type === 'section') {
			onSelectItem({
				type: 'section',
				id: node.sectionId || node.id.replace('section-', ''),
			});
			toggleCollapse(node.id);
		} else {
			toggleCollapse(node.id);
		}
	};

	const renderNode = (node: TreeNode, depth: number): React.ReactNode => {
		const isSelected = node.id === selectedId;
		const isOpen = !collapsed.has(node.id);
		const nodeErrors = errorMap.get(node.id) || [];
		const hasError = nodeErrors.length > 0;

		const indent = depth * 14;

		return (
			<Box key={node.id}>
				<Box
					onClick={() => handleNodeClick(node)}
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.75,
						px: 1,
						py: 0.55,
						pl: `${8 + indent}px`,
						cursor: 'pointer',
						borderRadius: '4px',
						bgcolor: isSelected ? 'rgba(155,197,61,0.15)' : 'transparent',
						border: isSelected
							? '1px solid rgba(155,197,61,0.3)'
							: '1px solid transparent',
						mx: 0.5,
						mb: 0.2,
						'&:hover': {
							bgcolor: isSelected
								? 'rgba(155,197,61,0.15)'
								: 'rgba(255,255,255,0.04)',
						},
					}}
				>
					{/* Expand/collapse arrow for non-field nodes */}
					{node.type !== 'field' && (
						<Box
							sx={{
								color: '#6b7a6e',
								flexShrink: 0,
								fontSize: 14,
								lineHeight: 1,
								width: 14,
							}}
						>
							{isOpen ? '▾' : '▸'}
						</Box>
					)}

					{/* Icon */}
					<Box
						sx={{
							color:
								node.type === 'section'
									? '#9bc53d'
									: node.type === 'page'
									? '#4caf6e'
									: '#9ba39d',
							flexShrink: 0,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						{node.type === 'section' ? (
							isOpen ? (
								<FolderOpenIcon sx={{ fontSize: 15 }} />
							) : (
								<FolderIcon sx={{ fontSize: 15 }} />
							)
						) : node.type === 'page' ? (
							<ArticleIcon sx={{ fontSize: 14 }} />
						) : (
							getFieldIcon(node.fieldType)
						)}
					</Box>

					{/* Label */}
					<Typography
						sx={{
							fontSize: '0.8rem',
							color:
								node.type === 'section'
									? '#e8eaf0'
									: node.type === 'page'
									? '#c8d0cc'
									: '#b0bab4',
							flex: 1,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							fontWeight: node.type === 'section' ? 600 : 400,
						}}
					>
						{node.label}
						{node.required && (
							<Box component="span" sx={{ color: '#ef5350', ml: 0.25 }}>
								*
							</Box>
						)}
					</Typography>

					{/* Badges */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.25,
							flexShrink: 0,
						}}
					>
						{node.conditional && (
							<Tooltip title="Has conditional logic" placement="right">
								<LockIcon sx={{ fontSize: 12, color: '#f0a050' }} />
							</Tooltip>
						)}
						{hasError && (
							<Tooltip title={nodeErrors.join('; ')} placement="right">
								<WarningAmberIcon sx={{ fontSize: 13, color: '#ef5350' }} />
							</Tooltip>
						)}
					</Box>
				</Box>

				{/* Children */}
				{node.type !== 'field' && node.children && node.children.length > 0 && (
					<Collapse in={isOpen} timeout={120}>
						{node.children.map((child) => renderNode(child, depth + 1))}
					</Collapse>
				)}
			</Box>
		);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Toolbar */}
			<Box sx={{ px: 1.5, pt: 1.5, pb: 1, flexShrink: 0 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
					<Typography
						sx={{
							fontSize: '0.72rem',
							color: '#9ba39d',
							fontWeight: 600,
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
							flex: 1,
						}}
					>
						Structure
					</Typography>
					<Tooltip title="Expand all">
						<IconButton
							size="small"
							onClick={expandAll}
							sx={{ color: '#6b7a6e', p: 0.4 }}
						>
							<UnfoldMoreIcon sx={{ fontSize: 15 }} />
						</IconButton>
					</Tooltip>
					<Tooltip title="Collapse all">
						<IconButton
							size="small"
							onClick={collapseAll}
							sx={{ color: '#6b7a6e', p: 0.4 }}
						>
							<UnfoldLessIcon sx={{ fontSize: 15 }} />
						</IconButton>
					</Tooltip>
				</Box>
				<TextField
					size="small"
					placeholder="Search fields…"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					InputProps={{
						startAdornment: (
							<SearchIcon sx={{ fontSize: 15, color: '#6b7a6e', mr: 0.5 }} />
						),
					}}
					sx={{
						width: '100%',
						'& .MuiOutlinedInput-root': {
							bgcolor: '#0d1017',
							color: '#e8eaf0',
							fontSize: '0.78rem',
							'& fieldset': { borderColor: '#2a3832' },
							'&:hover fieldset': { borderColor: '#9bc53d' },
							'&.Mui-focused fieldset': { borderColor: '#9bc53d' },
						},
					}}
				/>
			</Box>

			{/* Tree */}
			<Box sx={{ flex: 1, overflowY: 'auto', pb: 1 }}>
				{visibleTree.length === 0 ? (
					<Box
						sx={{
							px: 2,
							py: 3,
							color: '#4a5a4e',
							fontSize: '0.8rem',
							textAlign: 'center',
						}}
					>
						{search ? 'No matching fields' : 'No fields yet'}
					</Box>
				) : (
					visibleTree.map((node) => renderNode(node, 0))
				)}
			</Box>

			{/* Summary */}
			<Box
				sx={{ px: 1.5, py: 1, borderTop: '1px solid #2a3832', flexShrink: 0 }}
			>
				<Typography sx={{ fontSize: '0.72rem', color: '#6b7a6e' }}>
					{(formStructure.fields || []).length} fields
					{(formStructure.sections || []).length > 0 &&
						` · ${formStructure.sections!.length} sections`}
					{errors.length > 0 && (
						<Box component="span" sx={{ color: '#ef5350', ml: 0.5 }}>
							· {errors.length} error{errors.length > 1 ? 's' : ''}
						</Box>
					)}
				</Typography>
			</Box>
		</Box>
	);
};

export default SectionTree;

import {
	Alert,
	Box,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import { FC } from 'react';
import { PlotAutoBookRule } from '../../../../../types/gift_card';
import { Plot } from '../../../../../types/plot';

interface PlotAutoBookingRulesProps {
	plots: Plot[];
	rules: PlotAutoBookRule[];
	requiredTrees: number;
	totalSelectedTrees: number;
	validationError: string | null;
	onRuleChange: (plotId: number, update: Partial<PlotAutoBookRule>) => void;
}

const PlotAutoBookingRules: FC<PlotAutoBookingRulesProps> = ({
	plots,
	rules,
	requiredTrees,
	totalSelectedTrees,
	validationError,
	onRuleChange,
}) => {
	if (plots.length === 0) return null;

	return (
		<Box mt={3}>
			<Typography variant="h6" mb={1}>
				Auto-booking caps by plot
			</Typography>
			<Typography variant="body2" color="text.secondary" mb={2}>
				Configure each selected plot using either a percentage of currently
				available trees or a maximum tree count.
			</Typography>

			<Box display="grid" gap={2}>
				{plots.map((plot) => {
					const rule = rules.find((item) => item.plot_id === plot.id);
					if (!rule) return null;

					return (
						<Paper key={plot.id} variant="outlined" sx={{ p: 2 }}>
							<Box
								display="grid"
								gridTemplateColumns={{ xs: '1fr', md: '2fr 1fr 1fr 1fr' }}
								gap={2}
								alignItems="center"
							>
								<Box>
									<Typography fontWeight={600}>{plot.name}</Typography>
									<Typography variant="body2" color="text.secondary">
										Available for reservation: {rule.available_count}
									</Typography>
								</Box>

								<TextField
									select
									size="small"
									label="Mode"
									value={rule.mode}
									onChange={(event) =>
										onRuleChange(plot.id, {
											mode: event.target.value as PlotAutoBookRule['mode'],
										})
									}
								>
									<MenuItem value="count">Max trees</MenuItem>
									<MenuItem value="percentage">% of available</MenuItem>
								</TextField>

								<TextField
									size="small"
									type="number"
									label={rule.mode === 'percentage' ? 'Percent' : 'Max trees'}
									value={rule.value}
									inputProps={{
										min: 0,
										max:
											rule.mode === 'percentage' ? 100 : rule.available_count,
									}}
									onChange={(event) =>
										onRuleChange(plot.id, { value: Number(event.target.value) })
									}
								/>

								<Box>
									<Typography variant="body2" color="text.secondary">
										Reserved from plot
									</Typography>
									<Typography fontWeight={600}>{rule.tree_count}</Typography>
								</Box>
							</Box>
						</Paper>
					);
				})}
			</Box>

			<Box mt={2}>
				<Typography fontWeight={600}>
					Configured total: {totalSelectedTrees} / {requiredTrees}
				</Typography>
				{validationError && (
					<Alert severity="warning" sx={{ mt: 1 }}>
						{validationError}
					</Alert>
				)}
			</Box>
		</Box>
	);
};

export default PlotAutoBookingRules;

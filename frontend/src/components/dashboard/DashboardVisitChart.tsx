"use client";

import { useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { formatDate } from "@/lib/formater";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Delta, DeltaIcon, DeltaValue } from "@/components/Delta";

type PeriodDays = 7 | 30;

type VisitorChartRow = {
	date: string;
	visitors: number;
	pageViews: number;
};

const chartData: VisitorChartRow[] = [
	{ date: "2026-03-15", visitors: 245, pageViews: 892 },
	{ date: "2026-03-16", visitors: 231, pageViews: 856 },
	{ date: "2026-03-17", visitors: 268, pageViews: 943 },
	{ date: "2026-03-18", visitors: 289, pageViews: 1024 },
	{ date: "2026-03-19", visitors: 312, pageViews: 1108 },
	{ date: "2026-03-20", visitors: 298, pageViews: 1056 },
	{ date: "2026-03-21", visitors: 276, pageViews: 987 },
	{ date: "2026-03-22", visitors: 254, pageViews: 901 },
	{ date: "2026-03-23", visitors: 241, pageViews: 867 },
	{ date: "2026-03-24", visitors: 259, pageViews: 923 },
	{ date: "2026-03-25", visitors: 287, pageViews: 1012 },
	{ date: "2026-03-26", visitors: 305, pageViews: 1089 },
	{ date: "2026-03-27", visitors: 321, pageViews: 1156 },
	{ date: "2026-03-28", visitors: 298, pageViews: 1067 },
	{ date: "2026-03-29", visitors: 276, pageViews: 989 },
	{ date: "2026-03-30", visitors: 263, pageViews: 945 },
	{ date: "2026-03-31", visitors: 251, pageViews: 912 },
	{ date: "2026-04-01", visitors: 289, pageViews: 1034 },
	{ date: "2026-04-02", visitors: 312, pageViews: 1124 },
	{ date: "2026-04-03", visitors: 298, pageViews: 1089 },
	{ date: "2026-04-04", visitors: 276, pageViews: 998 },
	{ date: "2026-04-05", visitors: 254, pageViews: 923 },
	{ date: "2026-04-06", visitors: 189, pageViews: 678 },
	{ date: "2026-04-07", visitors: 201, pageViews: 712 },
	{ date: "2026-04-08", visitors: 267, pageViews: 945 },
	{ date: "2026-04-09", visitors: 289, pageViews: 1023 },
	{ date: "2026-04-10", visitors: 305, pageViews: 1098 },
	{ date: "2026-04-11", visitors: 321, pageViews: 1167 },
	{ date: "2026-04-12", visitors: 298, pageViews: 1089 },
	{ date: "2026-04-13", visitors: 312, pageViews: 1134 },
];

function parseChartDay(isoDate: string) {
	return new Date(`${isoDate}T12:00:00`);
}

/** Last day in `chartData`; used as the end of the “last N days” window. */
const lastChartRow = chartData.at(-1);
if (lastChartRow === undefined) {
	throw new Error("VisitorChart: chartData must include at least one row");
}
const visitorChartReferenceDate = parseChartDay(lastChartRow.date);

function rowTotal(row: VisitorChartRow) {
	return row.visitors + row.pageViews;
}

const chartConfig = {
	visitors: {
		label: "Visitors",
		color: "var(--chart-2)",
	},
	pageViews: {
		label: "Page Views",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

const animationConfig = {
	glowWidth: 520,
};

function highlightXFromChartMouseEvent(e: unknown): number | null {
	const ex = e as {
		activeCoordinate?: { x?: number; y?: number };
		chartX?: number;
	};
	const fromActive = ex.activeCoordinate?.x;
	if (typeof fromActive === "number" && Number.isFinite(fromActive)) {
		return fromActive;
	}
	const legacy = ex.chartX;
	if (typeof legacy === "number" && Number.isFinite(legacy)) {
		return legacy;
	}
	return null;
}

export function VisitorChart() {
	const chartUid = useId().replace(/:/g, "");
	const idMaskGrad = `visitor-chart-mask-grad-${chartUid}`;
	const idMask = `visitor-chart-highlight-mask-${chartUid}`;

	const [periodDays, setPeriodDays] = useState<PeriodDays>(7);
	const [xAxis, setXAxis] = useState<number | null>(null);

	const chartRows = useMemo(() => {
		const startDate = new Date(visitorChartReferenceDate);
		startDate.setDate(startDate.getDate() - periodDays);
		return chartData.filter((item) => parseChartDay(item.date) >= startDate);
	}, [periodDays]);

	const growthPctNum = useMemo(() => {
		const first = chartRows[0];
		if (!first) {
			return 0;
		}
		const last = chartRows.at(-1);
		if (!last) {
			return 0;
		}
		const a = rowTotal(first);
		const b = rowTotal(last);
		if (!a) {
			return 0;
		}
		return ((b - a) / a) * 100;
	}, [chartRows]);

	const xAxisMinTickGap: number | undefined = periodDays > 7 ? 32 : undefined;

	const idGradPageViews = `visitor-chart-grad-pageviews-${chartUid}`;
	const idGradVisitors = `visitor-chart-grad-visitors-${chartUid}`;

	return (
		<Card className="rounded-none border-0 bg-background py-4 shadow-none ring-0 lg:col-span-3">
			<CardHeader>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0 space-y-2">
						<div className="flex flex-wrap items-center gap-2">
							<CardTitle className="text-base">Website Traffic</CardTitle>
							<Delta value={growthPctNum} variant="badge">
								<DeltaIcon variant="trend" />
								<DeltaValue />
							</Delta>
						</div>
						<CardDescription>
							Daily visitors and page views, last {periodDays} days.
						</CardDescription>
					</div>
					<Select
						onValueChange={(v) => {
							const n = Number(v);
							if (n === 7 || n === 30) {
								setPeriodDays(n);
							}
						}}
						value={String(periodDays)}
					>
						<SelectTrigger
							aria-label="Sales chart time range"
							className="w-full min-w-36 sm:w-fit"
							size="sm"
						>
							<SelectValue placeholder="Range" />
						</SelectTrigger>
						<SelectContent align="end">
							<SelectItem value="7">Last 7 days</SelectItem>
							<SelectItem value="30">Last 30 days</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className="aspect-21/9 min-h-48 w-full p-0"
					config={chartConfig}
				>
					<AreaChart
						// accessibilityLayer
						data={chartRows}
						margin={{
							left: 4,
							right: 12,
							top: 8,
						}}
						onMouseLeave={() => setXAxis(null)}
						onMouseMove={(e) => setXAxis(highlightXFromChartMouseEvent(e))}
					>
						<CartesianGrid
							className="stroke-border"
							strokeDasharray="3 3"
							vertical={false}
						/>
						<XAxis
							axisLine={false}
							dataKey="date"
							interval={periodDays <= 7 ? 0 : "preserveStartEnd"}
							minTickGap={xAxisMinTickGap}
							tickFormatter={(value) => formatDate(String(value), "day-month")}
							tickLine={false}
							tickMargin={8}
						/>
						<ChartTooltip content={<ChartTooltipContent />} cursor={false} />

						<defs>
							<linearGradient id={idMaskGrad} x1="0" x2="1" y1="0" y2="0">
								<stop offset="0%" stopColor="transparent" />
								<stop offset="28%" stopColor="white" stopOpacity={0.55} />
								<stop offset="50%" stopColor="white" />
								<stop offset="72%" stopColor="white" stopOpacity={0.55} />
								<stop offset="100%" stopColor="transparent" />
							</linearGradient>
							<linearGradient id={idGradPageViews} x1="0" x2="0" y1="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-pageViews)"
									stopOpacity={0.4}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-pageViews)"
									stopOpacity={0}
								/>
							</linearGradient>
							<linearGradient id={idGradVisitors} x1="0" x2="0" y1="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-visitors)"
									stopOpacity={0.4}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-visitors)"
									stopOpacity={0}
								/>
							</linearGradient>
							{typeof xAxis === "number" && Number.isFinite(xAxis) ? (
								<mask id={idMask}>
									<rect
										fill={`url(#${idMaskGrad})`}
										height="100%"
										width={animationConfig.glowWidth}
										x={xAxis - animationConfig.glowWidth / 2}
										y={0}
									/>
								</mask>
							) : null}
						</defs>
						<Area
							dataKey="pageViews"
							fill={`url(#${idGradPageViews})`}
							fillOpacity={0.4}
							mask={`url(#${idMask})`}
							stackId="a"
							stroke="var(--color-pageViews)"
							strokeWidth={0.8}
							type="linear"
						/>
						<Area
							dataKey="visitors"
							fill={`url(#${idGradVisitors})`}
							fillOpacity={0.4}
							mask={`url(#${idMask})`}
							stackId="a"
							stroke="var(--color-visitors)"
							strokeWidth={0.8}
							type="linear"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

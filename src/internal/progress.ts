export const getProgressState = (value: number | undefined, max: number) => {
  const limit = Number.isFinite(max) && max > 0 ? max : 1;
  const current =
    value !== undefined && Number.isFinite(value) ? Math.min(limit, Math.max(0, value)) : undefined;
  const percentage = current === undefined ? undefined : (current / limit) * 100;
  const complete = current !== undefined && current === limit;
  const label =
    percentage === undefined
      ? undefined
      : complete
        ? "100%"
        : current === 0
          ? "0%"
          : percentage < 0.1
            ? "<0.1%"
            : `${Math.min(99.9, Math.floor(percentage * 10) / 10)}%`;
  return { limit, current, percentage, complete, label };
};

export type TimedEvent = { start?: string; end?: string };
export type PlacedEvent<Event> = {
  event: Event;
  start: number;
  end: number;
  lane: number;
  lanes: number;
};

const DAY = 24 * 60;
/** 表示上の最短の長さ。短すぎる予定でも時刻と題名の一行を読めるようにする。 */
const MIN_LENGTH = 30;

/** 「9:05」「09:05」「24:00」を0時からの分へ変換する。範囲外や形式違いはnull。 */
export const minutesOf = (value?: string) => {
  const match = value?.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const minutes = Number(match[1]) * 60 + Number(match[2]);
  return Number(match[2]) < 60 && minutes <= DAY ? minutes : null;
};

/** 開始がない、または読めない予定は終日として扱う。 */
export const isAllDay = (event: TimedEvent) => minutesOf(event.start) === null;

/** 終了がない、または開始以前なら開始から1時間とし、日付の終わりで止める。 */
export const eventRange = (event: TimedEvent) => {
  const start = Math.min(minutesOf(event.start) ?? 0, DAY - MIN_LENGTH);
  const end = minutesOf(event.end);
  return { start, end: Math.min(DAY, end !== null && end > start ? end : start + 60) };
};

/** 終日の予定を先に、時刻のある予定を開始の早い順に並べる。同じ開始なら長い予定を先にする。 */
export const sortEvents = <Event extends TimedEvent>(events: readonly Event[]) =>
  [...events].sort((a, b) => {
    if (isAllDay(a) !== isAllDay(b)) return isAllDay(a) ? -1 : 1;
    const left = eventRange(a);
    const right = eventRange(b);
    return left.start - right.start || right.end - left.end;
  });

/** 時間の重なる予定を横の列へ割り当てる。重なりのまとまりごとに列数をそろえる。 */
export const layoutDay = <Event extends TimedEvent>(events: readonly Event[]) => {
  const placed: PlacedEvent<Event>[] = [];
  let cluster: PlacedEvent<Event>[] = [];
  let clusterEnd = -1;
  const closeCluster = () => {
    const lanes = Math.max(1, ...cluster.map((item) => item.lane + 1));
    for (const item of cluster) item.lanes = lanes;
    placed.push(...cluster);
    cluster = [];
  };
  for (const event of sortEvents(events).filter((item) => !isAllDay(item))) {
    const range = eventRange(event);
    const visibleEnd = Math.max(range.end, range.start + MIN_LENGTH);
    if (range.start >= clusterEnd) closeCluster();
    const laneEnds = new Map<number, number>();
    for (const item of cluster)
      laneEnds.set(
        item.lane,
        Math.max(laneEnds.get(item.lane) ?? 0, Math.max(item.end, item.start + MIN_LENGTH)),
      );
    let lane = 0;
    while ((laneEnds.get(lane) ?? -1) > range.start) lane += 1;
    cluster.push({ event, ...range, lane, lanes: 1 });
    clusterEnd = Math.max(clusterEnd, visibleEnd);
  }
  closeCluster();
  return placed;
};

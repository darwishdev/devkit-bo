export const ObjectKeys = <T extends {}>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
}

export const subtractRecords = <TRecord>(dataRef: TRecord[], modelSelectionRef: TRecord[], dataKey: keyof TRecord): TRecord[] => {
  const dataCopy = [...dataRef];
  const selectionIds = new Set(modelSelectionRef.map(item => item[dataKey]));
  return dataCopy.filter(item => !selectionIds.has(item[dataKey]));
}

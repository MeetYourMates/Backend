export interface Socket<OnData, EmitData> {
  on (event: string, callback: (data: OnData) => void):any
  emit (event: string, data: EmitData):any
}

export type AppData = {
  allSockets: Socket<any, any>[]
}
// TODO: add enum for name of
export type SocketName = 'foo1'| 'foo2'| 'bar1'| 'bar2'

/*
  Kevin Hermawan
  Trisakti Connect Android
  @flow
*/
import feathers from 'feathers-client'
import io from 'socket.io-client'
import { url } from './server'

const host = url
const socket = io(host)
export const app = feathers().configure(feathers.socketio(socket)).configure(feathers.hooks())
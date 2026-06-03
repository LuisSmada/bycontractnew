import { Action, Reducer } from "@reduxjs/toolkit";

export const testReducer = <S , A extends Action>(reducer: Reducer<S, A>, action: A, previousState?: S): S => {
    return reducer(previousState, action)
}
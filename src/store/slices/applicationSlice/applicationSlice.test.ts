import type { IUser } from "@/src/model/entities";
import { expect, test } from "vitest";
import { applicationSlice, setCurrentUser } from "./applicationSlice";
import { testReducer } from "@/src/utils/testUtils";

test("The current user should be setted correctly", () => {
  const fakeUserData: IUser = {
    firstName: "Adams",
    lastName: "AYO",
    id: " 1"
  };

  const nextState = testReducer(
    applicationSlice.reducer,
    setCurrentUser(fakeUserData),
  );

  expect(nextState.currentUser).toStrictEqual(fakeUserData);
});

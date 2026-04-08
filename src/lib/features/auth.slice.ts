import { formDataDefault } from '@/defaults/auth.default'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  formData: formDataDefault,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    collectForData: (state, action) => {
      state.formData = action.payload
    },

    reset: () => {
      //   state.formData = formDataDefault
      //   state.paymentDetails = paymentDetailsDefault
      //   state.plan = planDefault
      //   state.country = countryDefault
    },
    setSummary: () => {},
  },
})

export const { collectForData, reset } = authSlice.actions

export default authSlice.reducer

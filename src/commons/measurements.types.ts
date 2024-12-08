type PosturalScoreKeys =
  | 'bodyLeanFBScore'
  | 'bodyLeanLRScore'
  | 'iliacCrestHeightScore'
  | 'shoulderHeightScore'
  | 'twistingBodyScore'

export type Scores = {
  total: number
  score: {
    [key in PosturalScoreKeys]: number
  }
}

export type Body = {
  id: string
  createdAt: string
  updatedAt: string
  measurements: Measurements
  meta: {
    baseBodyType: string
    scannerId: string
    locationName: string
  }
  nickname: string
  userId: string
  sex: Sex
  height: number
  birthday: string
  scores: {
    total: number
    score: {
      [key in PosturalScoreKeys]: number
    }
  }
  frameAnalysis: FrameAnalysis
}

export type Sex = 'male' | 'female' | 'unknown'

export type Measurements = {
  neckCircum: number
  collarCircum: number
  chestBustCircum: number
  chestBustCircumTape: number
  bustTopCircum: number
  bustTopCircumTape: number
  underBustCircum: number
  underBustCircumTape: number
  horizontalWaist: number
  horizontalWaistTape: number
  narrowWaist: number
  narrowWaistTape: number
  seatCircum: number
  seatCircumTape: number
  backShoulderWidth: number
  backShoulderWidthThroughBackNeck: number
  crotchHeight: number
  elbowCircumRight: number
  wristCircumRight: number
  upperArmCircumRight: number
  thighCircumRight: number
  calfCircumRight: number
  kneeCircumRight: number
  ankleCircumRight: number
  elbowCircumLeft: number
  wristCircumLeft: number
  upperArmCircumLeft: number
  thighCircumLeft: number
  calfCircumLeft: number
  kneeCircumLeft: number
  ankleCircumLeft: number
  bustVolumeRight: number
  bustVolumeLeft: number
  halfBackCenterTape: number
  armLengthRight: number
  inseamRightTape: number
  armLengthLeft: number
  inseamLeftTape: number
}

export type FrameAnalysis = Readonly<{
  frame: 'V' | 'I' | 'X' | 'A'
  upperDepth: number
  underDepth: number
}>

type Diagnostic = {
  bodyLeftRightTilt: number
  bodyForwardBehindTilt: number
  stoopingBack: number
  forwardHeadPosture: number
  xoLeg: number
  shoulderInclination: number
  pelvicTilt: number
  pelvicAsymmetry: number
  overweight: number
  underweight: number
  thighVolume: number
  totalScore: number
}
type Profile = {
  userId: string
  nickname: string
  birthday: string
  height: number
  sex: Sex
}

type PersonalColor = {
  personalColor: '1' | '2' | '3' | '4'
  version: '1.0.0'
}
export type BodyDetail = {
  id: string
  createdAt: string
  updatedAt: string
  scores: Scores
  frameAnalysis: FrameAnalysis
  measurements: Measurements
  baseBodyType: string
  dgsAnalysis: Diagnostic
  personalColor: PersonalColor
} & Profile

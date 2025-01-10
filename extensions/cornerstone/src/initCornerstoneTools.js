import {
  PanTool,
  WindowLevelTool,
  StackScrollTool,
  StackScrollMouseWheelTool,
  ZoomTool,
  VolumeRotateMouseWheelTool,
  MIPJumpToClickTool,
  LengthTool,
  RectangleROITool,
  RectangleROIThresholdTool,
  EllipticalROITool,
  CircleROITool,
  BidirectionalTool,
  ArrowAnnotateTool,
  DragProbeTool,
  ProbeTool,
  AngleTool,
  CobbAngleTool,
  MagnifyTool,
  CrosshairsTool,
  SegmentationDisplayTool,
  RectangleScissorsTool,
  SphereScissorsTool,
  CircleScissorsTool,
  BrushTool,
  PaintFillTool,
  init,
  addTool,
  annotation,
  ReferenceLinesTool,
  TrackballRotateTool,
  AdvancedMagnifyTool,
  UltrasoundDirectionalTool,
  PlanarFreehandROITool,
  SplineROITool,
  LivewireContourTool,
  OrientationMarkerTool,
} from '@cornerstonejs/tools';

import CalibrationLineTool from './tools/CalibrationLineTool';
import ImageOverlayViewerTool from './tools/ImageOverlayViewerTool';
import SpineLabelingTool from './tools/SpineLabelingTool'; // Import the new tool

export default function initCornerstoneTools(configuration = {}) {
  CrosshairsTool.isAnnotation = false;
  ReferenceLinesTool.isAnnotation = false;

  init(configuration);
  addTool(PanTool);
  addTool(WindowLevelTool);
  // addTool(CustomDragTool);
  addTool(StackScrollMouseWheelTool);
  addTool(StackScrollTool);
  addTool(ZoomTool);
  addTool(ProbeTool);
  addTool(VolumeRotateMouseWheelTool);
  addTool(MIPJumpToClickTool);
  addTool(LengthTool);
  addTool(RectangleROITool);
  addTool(RectangleROIThresholdTool);
  addTool(EllipticalROITool);
  addTool(CircleROITool);
  addTool(BidirectionalTool);
  addTool(ArrowAnnotateTool);
  addTool(DragProbeTool);
  addTool(AngleTool);
  addTool(CobbAngleTool);
  addTool(MagnifyTool);
  addTool(CrosshairsTool);
  addTool(SegmentationDisplayTool);
  addTool(RectangleScissorsTool);
  addTool(SphereScissorsTool);
  addTool(CircleScissorsTool);
  addTool(BrushTool);
  addTool(PaintFillTool);
  addTool(ReferenceLinesTool);
  addTool(CalibrationLineTool);
  addTool(ImageOverlayViewerTool);
  addTool(SpineLabelingTool); // Add the SpineLabelingTool
  addTool(TrackballRotateTool);
  addTool(AdvancedMagnifyTool);
  addTool(UltrasoundDirectionalTool);
  addTool(PlanarFreehandROITool);
  addTool(SplineROITool);
  addTool(LivewireContourTool);
  addTool(OrientationMarkerTool);

  // Modify annotation tools to use dashed lines on SR
  const annotationStyle = {
    textBoxFontSize: '15px',
    lineWidth: '1.5',
  };

  const defaultStyles = annotation.config.style.getDefaultToolStyles();
  annotation.config.style.setDefaultToolStyles({
    global: {
      ...defaultStyles.global,
      ...annotationStyle,
    },
  });
}

const toolNames = {
  Pan: PanTool.toolName,
  ArrowAnnotate: ArrowAnnotateTool.toolName,
  WindowLevel: WindowLevelTool.toolName,
  StackScroll: StackScrollTool.toolName,
  StackScrollMouseWheel: StackScrollMouseWheelTool.toolName,
  Zoom: ZoomTool.toolName,
  // CustomDragTool: CustomDragTool.toolName,
  VolumeRotateMouseWheel: VolumeRotateMouseWheelTool.toolName,
  MipJumpToClick: MIPJumpToClickTool.toolName,
  Length: LengthTool.toolName,
  DragProbe: DragProbeTool.toolName,
  Probe: ProbeTool.toolName,
  RectangleROI: RectangleROITool.toolName,
  RectangleROIThreshold: RectangleROIThresholdTool.toolName,
  EllipticalROI: EllipticalROITool.toolName,
  CircleROI: CircleROITool.toolName,
  Bidirectional: BidirectionalTool.toolName,
  Angle: AngleTool.toolName,
  CobbAngle: CobbAngleTool.toolName,
  Magnify: MagnifyTool.toolName,
  Crosshairs: CrosshairsTool.toolName,
  SegmentationDisplay: SegmentationDisplayTool.toolName,
  Brush: BrushTool.toolName,
  PaintFill: PaintFillTool.toolName,
  ReferenceLines: ReferenceLinesTool.toolName,
  CalibrationLine: CalibrationLineTool.toolName,
  TrackballRotateTool: TrackballRotateTool.toolName,
  CircleScissors: CircleScissorsTool.toolName,
  RectangleScissors: RectangleScissorsTool.toolName,
  SphereScissors: SphereScissorsTool.toolName,
  ImageOverlayViewer: ImageOverlayViewerTool.toolName,
  AdvancedMagnify: AdvancedMagnifyTool.toolName,
  UltrasoundDirectional: UltrasoundDirectionalTool.toolName,
  SplineROI: SplineROITool.toolName,
  LivewireContour: LivewireContourTool.toolName,
  PlanarFreehandROI: PlanarFreehandROITool.toolName,
  OrientationMarker: OrientationMarkerTool.toolName,
  SpineLabeling: SpineLabelingTool.toolName, // Add SpineLabelingTool name
};

export { toolNames };
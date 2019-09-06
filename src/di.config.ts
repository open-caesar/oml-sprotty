/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { Container, ContainerModule } from "inversify";
import { ConsoleLogger, ExpandButtonHandler, ExpandButtonView, HtmlRoot,
    HtmlRootView, LogLevel, PolylineEdgeView, PreRenderedElement,
    PreRenderedView, SCompartment, SCompartmentView,
    SGraphView, SLabel, SLabelView, TYPES, boundsModule,
    buttonModule, configureModelElement, decorationModule, defaultModule,
    edgeEditModule, edgeLayoutModule, expandModule,
    exportModule, fadeModule, hoverModule, labelEditModule, modelSourceModule, moveModule,
    openModule, overrideViewerOptions, routingModule, selectModule, updateModule, undoRedoModule,
    viewportModule, SButton, SModelRoot } from 'sprotty';
// import { popupModelFactory } from "./popup";
import {CaseNodeView, ChoiceNodeView, ClassNodeView, CompositionEdgeView, SpecializationArrowEdgeView,
    SpecializationEdgeView, HeaderCompartmentView, ImportEdgeView, ModuleNodeView, NoteView, TagView,
    UsesNodeView, CardinalLabelView, RestrictsArrowEdgeView, RelationshipLabelView,
    RestrictsLabelView, RelationshipArrowEdgeView } from "./views";
import { ModuleNode, Tag, OmlLabel, OmlNode, OmlEdge, OmlDiagram, OmlEditableLabel } from "./oml-models";
import { OmlModelFactory } from "./model-factory";

const omlDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope()
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn)
    rebind(TYPES.IModelFactory).to(OmlModelFactory).inSingletonScope()
    // bind(TYPES.PopupModelFactory).toConstantValue(popupModelFactory)
    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', OmlDiagram, SGraphView);
    configureModelElement(context, 'node:class', OmlNode, ClassNodeView)
    configureModelElement(context, 'node:module', ModuleNode, ModuleNodeView)
    configureModelElement(context, 'node:choice', OmlNode, ChoiceNodeView)
    configureModelElement(context, 'node:case', OmlNode, CaseNodeView)
    configureModelElement(context, 'node:pill', OmlNode, UsesNodeView)
    configureModelElement(context, 'node:note', OmlNode, NoteView)
    configureModelElement(context, 'label:heading', SLabel, SLabelView)
    configureModelElement(context, 'label:text', SLabel, SLabelView)
    configureModelElement(context, 'label:subtext', SLabel, CardinalLabelView)
    configureModelElement(context, 'label:restricts', SLabel, RestrictsLabelView)
    configureModelElement(context, 'label:relationship', SLabel, RelationshipLabelView)
    configureModelElement(context, 'label:editable', OmlEditableLabel, SLabelView)
    configureModelElement(context, 'ylabel:text', OmlLabel, SLabelView)
    configureModelElement(context, 'label:classHeader', SLabel, SLabelView)
    configureModelElement(context, 'tag', Tag, TagView)
    configureModelElement(context, 'label:tag', SLabel, SLabelView)
    configureModelElement(context, 'comp:comp', SCompartment, SCompartmentView)
    configureModelElement(context, 'comp:classHeader', SCompartment, HeaderCompartmentView)
    configureModelElement(context, 'edge:straight', OmlEdge, PolylineEdgeView)
    configureModelElement(context, 'edge:composition', OmlEdge, CompositionEdgeView)
    configureModelElement(context, 'edge:dashed', OmlEdge, SpecializationEdgeView)
    configureModelElement(context, 'edge:import', OmlEdge, ImportEdgeView)
    configureModelElement(context, 'edge:uses', OmlEdge, SpecializationArrowEdgeView)
    configureModelElement(context, 'edge:augments', OmlEdge, RelationshipArrowEdgeView)
    configureModelElement(context, 'edge:restricts', OmlEdge, RestrictsArrowEdgeView)
    configureModelElement(context, 'edge:relationship', OmlEdge, RelationshipLabelView)
    configureModelElement(context, 'palette', SModelRoot, HtmlRootView)
    configureModelElement(context, 'html', HtmlRoot, HtmlRootView)
    configureModelElement(context, 'pre-rendered', PreRenderedElement, PreRenderedView)
    configureModelElement(context, ExpandButtonHandler.TYPE, SButton, ExpandButtonView)
})

export default function createContainer(widgetId: string): Container {
    const container = new Container()
    container.load(
        defaultModule, selectModule, moveModule, boundsModule, undoRedoModule, viewportModule,
        hoverModule, fadeModule, exportModule, expandModule, openModule, buttonModule, modelSourceModule,
        decorationModule, edgeEditModule, edgeLayoutModule, labelEditModule, updateModule, routingModule,
        omlDiagramModule
    );
    //        container.bind(TYPES.ModelSource).to(TheiaDiagramServer).inSingletonScope()
    overrideViewerOptions(container, {
        needsClientLayout: true,
        needsServerLayout: true,
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden'
    })
    return container
}
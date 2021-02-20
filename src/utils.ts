import ReactReconciler from 'react-reconciler';

export const noop = () => { };

const microtaskPromise = Promise.resolve();
export function queueMicrotask(callback: () => void) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises, promise/catch-or-return, promise/prefer-await-to-then, promise/no-callback-in-promise
  microtaskPromise.then(callback);
}

export const reactPanoramaSymbol = Symbol('_reactPanoramaSymbol');

export type InternalPanel<T extends PanelBase = Panel> = T & {
  _reactPanoramaSymbol?: typeof reactPanoramaSymbol;
  _rootContainer?: ReactReconciler.FiberRoot;
  _eventHandlers?: Record<string, (...args: any[]) => void>;
  _rotateParams?: Partial<Record<string, number>>;
  _econItemDef?: number;
  _econItemStyle?: number;
};

// TODO: Put it into a shared library?
const dotaHud = (() => {
  let panel: Panel | null = $.GetContextPanel();
  while (panel) {
    if (panel.id === 'DotaHud') return panel;
    panel = panel.GetParent();
  }
})()!;

export const temporaryPanelHost =
  dotaHud.FindChild('__react_panorama_temporary_host__') ??
  $.CreatePanel('Panel', dotaHud, '__react_panorama_temporary_host__');
temporaryPanelHost.RemoveAndDeleteChildren();
temporaryPanelHost.visible = false;

export const temporaryScenePanelHost =
  dotaHud.FindChild('__react_panorama_temporary_scene_host__') ??
  $.CreatePanel('Panel', dotaHud, '__react_panorama_temporary_scene_host__');
temporaryScenePanelHost.RemoveAndDeleteChildren();
temporaryScenePanelHost.visible = false;

const checkFunc = () => {
  for (let i = 0; i < temporaryScenePanelHost.GetChildCount(); i += 1) {
    const child = temporaryScenePanelHost.GetChild(i);
    if (child?.BHasClass('SceneLoaded')) {
      child.SetParent(temporaryPanelHost);
    }
  }

  temporaryPanelHost.RemoveAndDeleteChildren();
  $.Schedule(1, checkFunc);
};

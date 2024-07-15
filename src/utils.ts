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

export const temporaryPanelHost = function ():Panel
{
  let temp = windowRoot.FindChildTraverse('__react_panorama_temporary_host__');

  if (!temp)
  {
    temp = $.CreatePanel('Panel', windowRoot, '__react_panorama_temporary_host__');
    temp.visible = false;
  }

  return temp;
}

export const temporaryScenePanelHost = function ():Panel
{
  let temp = windowRoot.FindChildTraverse('__react_panorama_temporary_scene_host__');

  if (!temp)
  {
    temp = $.CreatePanel('Panel', windowRoot, '__react_panorama_temporary_scene_host__');
    temp.visible = false;
  }

  return temp;
}

const checkFunc = () =>
{
  {
    const temp = temporaryScenePanelHost();
    for (let i = 0; i < temp.GetChildCount(); i += 1)
    {
      const child = temp.GetChild(i);
      if (child !== null)
      {
        if (child.BHasClass('SceneLoaded'))
        {
          child.SetParent(temporaryPanelHost());
        }
      }
    }
  }

  {
    let panels = temporaryPanelHost().Children();
    for (let i = panels.length - 1; i >= 0; i--)
    {
      panels[i].DeleteAsync(0);
    }
  }
  // temporaryPanelHost.RemoveAndDeleteChildren();
  windowRoot._temporaryScheduleHandle = $.Schedule(1, checkFunc);
};

type _InPanel = Panel & {
  _temporaryScheduleHandle:ScheduleID
}

// TODO: Put it into a shared library?
const windowRoot:_InPanel = (() => {
  let panel: Panel | null = $.GetContextPanel();
  while (panel) {
    if (panel.BHasClass('WindowRoot'))
    {
      $.Schedule(1,checkFunc)

      return panel as _InPanel;
    }
    panel = panel.GetParent();
  }
})()!;

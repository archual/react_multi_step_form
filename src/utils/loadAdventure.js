export const  loadAdventure = (nid, handlers = {}, history, step) => {
  if (!nid) {
    history.push(`/submityouradventure`);
    return;
  }

  handlers.setInitialState();
  handlers.getDraftData(nid);
};
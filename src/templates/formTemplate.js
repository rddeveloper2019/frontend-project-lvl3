const formTemplate = `<div class="row">
  <div class="col">
    <div class="form-floating">
      <input
        id="url-input"
        autofocus=""
        name="url"
        aria-label="url"
        class="form-control w-100"
        placeholder="ссылка RSS"
        autocomplete="off"
      />
      <label for="url-input">Ссылка RSS</label>
    </div>
  </div>
  <div class="col-auto">
    <button
      type="submit"
      aria-label="add"
      class="h-100 btn btn-lg btn-dark px-sm-5 border border-light"
      id="add-feed-button"
    >
      Добавить
    </button>
  </div>
</div>`;

export default formTemplate;

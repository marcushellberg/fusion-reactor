import '@polymer/iron-icon';
import { showNotification } from '@vaadin/flow-frontend/a-notification';
import { Binder, field } from '@vaadin/form';
import { EndpointError } from '@vaadin/fusion-frontend';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-date-picker';
import '@vaadin/vaadin-date-time-picker';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-grid';
import { GridDataProviderCallback, GridDataProviderParams, GridElement } from '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-split-layout';
import '@vaadin/vaadin-template-renderer';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-upload';
import Person from 'Frontend/generated/com/example/application/data/entity/Person';
import PersonModel from 'Frontend/generated/com/example/application/data/entity/PersonModel';
import * as PersonEndpoint from 'Frontend/generated/PersonEndpoint';
import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { View } from '../view';

@customElement('list-view')
export class ListView extends View {
  @query('#grid')
  private grid!: GridElement;

  @property({ type: Number })
  private gridSize = 0;

  private gridDataProvider = this.getGridData.bind(this);

  private binder = new Binder<Person, PersonModel>(this, PersonModel);

  render() {
    return html`
      <vaadin-split-layout class="w-full h-full">
        <div class="flex-grow w-full">
          <vaadin-grid
            id="grid"
            class="w-full h-full"
            theme="no-border"
            .size=${this.gridSize}
            .dataProvider=${this.gridDataProvider}
            @active-item-changed=${this.itemSelected}
          >
            <vaadin-grid-sort-column auto-width path="firstName"></vaadin-grid-sort-column>
            <vaadin-grid-sort-column auto-width path="lastName"></vaadin-grid-sort-column>
            <vaadin-grid-sort-column auto-width path="email"></vaadin-grid-sort-column>
            <vaadin-grid-sort-column auto-width path="phone"></vaadin-grid-sort-column>
            <vaadin-grid-sort-column auto-width path="dateOfBirth"></vaadin-grid-sort-column>
          </vaadin-grid>
        </div>
        <div class="flex flex-col" style="width: 400px;">
          <div class="p-l flex-grow">
            <vaadin-form-layout
              ><vaadin-text-field
                label="First name"
                id="firstName"
                ${field(this.binder.model.firstName)}
              ></vaadin-text-field
              ><vaadin-text-field
                label="Last name"
                id="lastName"
                ${field(this.binder.model.lastName)}
              ></vaadin-text-field
              ><vaadin-text-field label="Email" id="email" ${field(this.binder.model.email)}></vaadin-text-field
              ><vaadin-text-field label="Phone" id="phone" ${field(this.binder.model.phone)}></vaadin-text-field
              ><vaadin-date-picker
                label="Date of birth"
                id="dateOfBirth"
                ${field(this.binder.model.dateOfBirth)}
              ></vaadin-date-picker
            ></vaadin-form-layout>
          </div>
          <vaadin-horizontal-layout class="w-full flex-wrap bg-contrast-5 py-s px-l" theme="spacing">
            <vaadin-button theme="primary" @click=${this.save}>Save</vaadin-button>
            <vaadin-button theme="tertiary" @click=${this.cancel}>Cancel</vaadin-button>
          </vaadin-horizontal-layout>
        </div>
      </vaadin-split-layout>
    `;
  }

  private async getGridData(
    params: GridDataProviderParams<Person>,
    callback: GridDataProviderCallback<Person | undefined>
  ) {
    const index = params.page * params.pageSize;
    const data = (await PersonEndpoint.list(index, params.pageSize, params.sortOrders as any)) as Person[];
    callback(data);
  }

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'h-full');
    this.gridSize = (await PersonEndpoint.count()) ?? 0;
  }

  private async itemSelected(event: CustomEvent) {
    const item: Person = event.detail.value as Person;
    this.grid.selectedItems = item ? [item] : [];

    if (item) {
      const fromBackend = await PersonEndpoint.get(item.id!);
      fromBackend ? this.binder.read(fromBackend) : this.refreshGrid();
    } else {
      this.clearForm();
    }
  }

  private async save() {
    try {
      const isNew = !this.binder.value.id;
      await this.binder.submitTo(PersonEndpoint.update);
      if (isNew) {
        // We added a new item
        this.gridSize++;
      }
      this.clearForm();
      this.refreshGrid();
      showNotification(`Person details stored.`, { position: 'bottom-start' });
    } catch (error: any) {
      if (error instanceof EndpointError) {
        showNotification(`Server error. ${error.message}`, { position: 'bottom-start' });
      } else {
        throw error;
      }
    }
  }

  private cancel() {
    this.grid.activeItem = undefined;
  }

  private clearForm() {
    this.binder.clear();
  }

  private refreshGrid() {
    this.grid.selectedItems = [];
    this.grid.clearCache();
  }
}

import {
  render,
  RenderComponentOptions,
  screen,
} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { addTranslations, createTranslocoTestingModule } from '@/testing';
import { HelloComponent } from './hello.component';
import { HelloModule } from './hello.module';

describe('HelloComponent', () => {
  it('should initially render "Hello ACME" in a heading', async () => {
    await renderComponent();

    const heading = screen.getByRole('heading', {
      name: 'Hello ACME',
      level: 1,
    });
    expect(heading).toBeTruthy();
  });

  it(`should render a label and an input for the receiver`, async () => {
    const { getByLabelText } = await renderComponent();

    const input = getByLabelText(/receiver/i);
    expect(input).toBeTruthy();
  });

  it('should greet "Angular" when it is typed in the input', async () => {
    await renderComponent();

    const input: HTMLInputElement = screen.getByLabelText(/receiver/i);
    expect(input.value).toBe('ACME');

    input.setSelectionRange(0, 99);
    userEvent.type(input, '{backspace}Angular');

    const heading = screen.getByRole('heading', { name: /angular/i, level: 1 });
    expect(heading).toBeTruthy();
  });
});

async function renderComponent(
  options?: RenderComponentOptions<HelloComponent>
) {
  return render(HelloComponent, {
    excludeComponentDeclaration: true,
    imports: [
      HelloModule,
      createTranslocoTestingModule(
        addTranslations({
          hello: {
            _label: { receiver: 'Receiver' },
            greeting: 'Hello {{ receiver }}',
          },
        })
      ),
    ],
    ...options,
  });
}

import React from 'react';
import { render } from '@testing-library/react-native';
import KeyValueRow from './KeyValueRow';
import { IconName } from '../../components/Icons/Icon';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('KeyValueRow', () => {
  describe('Prebuilt Component', () => {
    describe('KeyValueRow', () => {
      it('should render when there is only text', () => {
        const { toJSON } = render(
          <KeyValueRow
            field={{ text: 'Sample Key Text' }}
            value={{ text: 'Sample Value Text' }}
          />,
        );

        expect(toJSON()).toMatchSnapshot();
      });

      it('should render text with tooltips', () => {
        const { toJSON } = render(
          <KeyValueRow
            field={{
              text: 'Key Text',
              tooltip: {
                title: 'Sample Tooltip 1',
                text: 'Tooltip 1 text',
              },
            }}
            value={{
              text: 'Value Text',
              tooltip: {
                title: 'Sample Tooltip 2',
                text: 'Tooltip 2 text',
              },
            }}
          />,
        );

        expect(toJSON()).toMatchSnapshot();
      });

      it('should render text with icons', () => {
        const { toJSON } = render(
          <KeyValueRow
            field={{
              text: 'Key Text',
              icon: {
                name: IconName.Activity,
              },
            }}
            value={{
              text: 'Value Text',
              icon: {
                name: IconName.Add,
              },
            }}
          />,
        );

        expect(toJSON()).toMatchSnapshot();
      });

      it('should render text with icons and tooltips', () => {
        const { toJSON } = render(
          <KeyValueRow
            field={{
              text: 'Key Text',
              icon: {
                name: IconName.Activity,
              },
              tooltip: {
                title: 'Sample Tooltip 2',
                text: 'Tooltip 2 text',
              },
            }}
            value={{
              text: 'Value Text',
              icon: {
                name: IconName.Add,
              },
              tooltip: {
                title: 'Sample Tooltip 2',
                text: 'Tooltip 2 text',
              },
            }}
          />,
        );

        expect(toJSON()).toMatchSnapshot();
      });
    });
  });
});

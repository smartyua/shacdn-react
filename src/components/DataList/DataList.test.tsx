import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataList, DataListItem, DataListLabel, DataListValue } from './DataList';

describe('DataList', () => {
  it('renders terms and values', () => {
    render(
      <DataList>
        <DataListItem>
          <DataListLabel>Status</DataListLabel>
          <DataListValue>Active</DataListValue>
        </DataListItem>
        <DataListItem>
          <DataListLabel>Region</DataListLabel>
          <DataListValue>eu-west-1</DataListValue>
        </DataListItem>
      </DataList>
    );

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('eu-west-1')).toBeInTheDocument();
  });
});

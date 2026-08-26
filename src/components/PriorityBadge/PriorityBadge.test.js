import { render, screen } from '@testing-library/react';
import PriorityBadge, { PRIORITY_RANK } from './PriorityBadge';

describe('PriorityBadge', () => {
    test('defaults to Normal when no priority given', () => {
        render(<PriorityBadge />);
        expect(screen.getByText('Normal')).toBeInTheDocument();
    });

    test('urgent uses the danger variant', () => {
        render(<PriorityBadge priority="Urgent" />);
        expect(screen.getByText('Urgent').className).toMatch(/bg-danger/);
    });

    test('PRIORITY_RANK orders urgent first', () => {
        expect(PRIORITY_RANK.urgent).toBeLessThan(PRIORITY_RANK.high);
        expect(PRIORITY_RANK.high).toBeLessThan(PRIORITY_RANK.normal);
        expect(PRIORITY_RANK.normal).toBeLessThan(PRIORITY_RANK.low);
    });
});

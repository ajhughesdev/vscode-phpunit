import { FilterStrategyFactory } from './FilterStrategy';
import { TestDefinition, TestType } from '../types';

describe('FilterStrategy Test', () => {
    describe('ClassFilterStrategy', () => {
        it('should encode file path with spaces', () => {
            const testDefinition: TestDefinition = {
                id: 'test1',
                label: 'TestClass',
                type: TestType.class,
                depth: 0,
                file: '/path/with spaces/TestFile.php',
            };

            const strategy = FilterStrategyFactory.getStrategy(testDefinition);
            const filter = strategy.getFilter();

            expect(filter).toEqual(encodeURIComponent('/path/with spaces/TestFile.php'));
            expect(decodeURIComponent(filter)).toEqual('/path/with spaces/TestFile.php');
        });

        it('should encode file path without spaces', () => {
            const testDefinition: TestDefinition = {
                id: 'test2',
                label: 'TestClass',
                type: TestType.class,
                depth: 0,
                file: '/path/without-spaces/TestFile.php',
            };

            const strategy = FilterStrategyFactory.getStrategy(testDefinition);
            const filter = strategy.getFilter();

            expect(filter).toEqual(encodeURIComponent('/path/without-spaces/TestFile.php'));
            expect(decodeURIComponent(filter)).toEqual('/path/without-spaces/TestFile.php');
        });

        it('should return empty string when file is undefined', () => {
            const testDefinition: TestDefinition = {
                id: 'test3',
                label: 'TestClass',
                type: TestType.class,
                depth: 0,
            };

            const strategy = FilterStrategyFactory.getStrategy(testDefinition);
            const filter = strategy.getFilter();

            expect(filter).toEqual('');
        });
    });

    describe('DescribeFilterStrategy', () => {
        it('should encode file path with spaces', () => {
            const testDefinition: TestDefinition = {
                id: 'test4',
                label: 'test method',
                type: TestType.describe,
                depth: 0,
                file: '/path/with spaces/TestFile.php',
                methodName: 'testMethod',
            };

            const strategy = FilterStrategyFactory.getStrategy(testDefinition);
            const filter = strategy.getFilter();

            expect(filter).toContain(encodeURIComponent('/path/with spaces/TestFile.php'));
        });
    });

    describe('MethodFilterStrategy', () => {
        it('should encode file path with spaces', () => {
            const testDefinition: TestDefinition = {
                id: 'test5',
                label: 'test method',
                type: TestType.method,
                depth: 0,
                file: '/path/with spaces/TestFile.php',
                methodName: 'testMethod',
            };

            const strategy = FilterStrategyFactory.getStrategy(testDefinition);
            const filter = strategy.getFilter();

            expect(filter).toContain(encodeURIComponent('/path/with spaces/TestFile.php'));
        });

        it('should handle method without filter when has children', () => {
            const testDefinition: TestDefinition = {
                id: 'test6',
                label: 'test method',
                type: TestType.method,
                depth: 0,
                file: '/path/with spaces/TestFile.php',
                methodName: 'testMethod',
                children: [{
                    id: 'test6-child',
                    label: 'child test',
                    type: TestType.method,
                    depth: 1,
                    methodName: 'childTest',
                }],
            };

            const strategy = FilterStrategyFactory.getStrategy(testDefinition);
            const filter = strategy.getFilter();

            // When method has children, getDependsFilter returns empty string
            // The filter will just be the encoded file path (without leading space since empty string is filtered out)
            expect(filter).toEqual(encodeURIComponent('/path/with spaces/TestFile.php'));
        });
    });

    describe('NamespaceFilterStrategy', () => {
        it('should not encode file path for namespace', () => {
            const testDefinition: TestDefinition = {
                id: 'test7',
                label: 'App\\Tests\\Unit',
                type: TestType.namespace,
                depth: 0,
                namespace: 'App\\Tests\\Unit',
            };

            const strategy = FilterStrategyFactory.getStrategy(testDefinition);
            const filter = strategy.getFilter();

            expect(filter).toContain('App\\\\Tests\\\\Unit');
        });
    });
});

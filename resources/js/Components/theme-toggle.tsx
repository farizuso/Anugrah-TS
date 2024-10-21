import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { useTheme } from '@/Components/theme-provider';
import { CiSun } from "react-icons/ci";
import { FaRegMoon } from "react-icons/fa";


// import { IconMoonStar, IconSun } from '@irsyadadl/paranoid';

export function ThemeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                    {/* <IconSun className='size-4 text-muted-foreground rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' /> */}
                    {/* <IconMoonStar className='absolute size-4 text-muted-foreground rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' /> */}
                    <CiSun />
                    <FaRegMoon />
                    <span className='sr-only'>Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

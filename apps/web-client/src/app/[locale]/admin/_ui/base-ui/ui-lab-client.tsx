'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Autocomplete,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Checkbox,
  CheckboxGroup,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Field,
  Fieldset,
  FieldsetLegend,
  Form,
  Input,
  Menu,
  Menubar,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PreviewCard,
  Progress,
  Radio,
  RadioGroup,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  SliderThumb,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toast,
  Toggle,
  ToggleGroup,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarSeparator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@make-the-change/core/ui'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

const BASE_UI_COMPONENT_REGISTRY = {
  Accordion,
  AlertDialog,
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  CheckboxGroup,
  Collapsible,
  Combobox,
  ContextMenu,
  Dialog,
  Field,
  Fieldset,
  Form,
  Input,
  Menu,
  Menubar,
  Meter,
  NavigationMenu,
  NumberField,
  Popover,
  PreviewCard,
  Progress,
  Radio,
  ScrollArea,
  Select,
  Separator,
  Slider,
  Switch,
  Tabs,
  Toast,
  Toggle,
  ToggleGroup,
  Toolbar,
  Tooltip,
} as const

const coveredComponents = Object.keys(BASE_UI_COMPONENT_REGISTRY).length

export function BaseUiLabClient() {
  const [isAlertOpen, setAlertOpen] = useState(false)
  const [isPopoverOpen, setPopoverOpen] = useState(false)

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-6 md:p-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Base UI Lab</h1>
        <p className="text-sm text-muted-foreground">
          Couverture composants Base UI: {coveredComponents}/35
        </p>
      </header>

      <section className="grid gap-4 rounded-2xl border border-border bg-background p-5">
        <h2 className="text-lg font-bold">Inputs & Selection</h2>
        <Form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <Field className="space-y-2">
            <Input placeholder="Nom du projet" />
          </Field>

          <Fieldset className="space-y-2 rounded-lg border border-border p-3">
            <FieldsetLegend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Préférences
            </FieldsetLegend>
            <CheckboxGroup defaultValue={['newsletter']} className="grid gap-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox value="newsletter" />
                Newsletter
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox value="alerts" />
                Alertes produit
              </label>
            </CheckboxGroup>
          </Fieldset>

          <div className="space-y-2">
            <Select defaultValue="fr">
              <SelectTrigger>
                <SelectValue placeholder="Langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <RadioGroup defaultValue="monthly">
              <label className="flex items-center gap-2 text-sm">
                <Radio value="weekly" />
                Hebdomadaire
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Radio value="monthly" />
                Mensuel
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Intensité</p>
            <Slider defaultValue={[45]}>
              <SliderThumb />
            </Slider>
          </div>

          <div className="flex items-center gap-3">
            <Switch defaultChecked />
            <span className="text-sm text-muted-foreground">Notifications actives</span>
          </div>
        </Form>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-background p-5">
        <h2 className="text-lg font-bold">Navigation & Layout</h2>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Découvrir</NavigationMenuTrigger>
              <NavigationMenuContent className="w-[280px]">
                <p className="text-sm text-muted-foreground">Contenu de navigation mega-menu.</p>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="rounded-md px-3 py-2 text-sm hover:bg-accent">
                Lien simple
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Tabs defaultValue="tab-a" className="w-full">
          <TabsList>
            <TabsTrigger value="tab-a">Aperçu</TabsTrigger>
            <TabsTrigger value="tab-b">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="tab-a" className="text-sm text-muted-foreground">
            Contenu onglet aperçu.
          </TabsContent>
          <TabsContent value="tab-b" className="text-sm text-muted-foreground">
            Contenu onglet settings.
          </TabsContent>
        </Tabs>

        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Section 1</AccordionTrigger>
            <AccordionContent>Contenu accordéon.</AccordionContent>
          </AccordionItem>
        </Accordion>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="text-sm font-semibold">Afficher plus</CollapsibleTrigger>
          <CollapsibleContent className="text-sm text-muted-foreground">
            Détails complémentaires du composant collapsible.
          </CollapsibleContent>
        </Collapsible>

        <ScrollArea className="h-24 rounded-md border border-border p-3">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Élément 1</p>
            <p>Élément 2</p>
            <p>Élément 3</p>
            <p>Élément 4</p>
            <p>Élément 5</p>
          </div>
        </ScrollArea>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-background p-5">
        <h2 className="text-lg font-bold">Overlay & Feedback</h2>

        <div className="flex flex-wrap items-center gap-2">
          <Dialog>
            <DialogTrigger className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted">
              Ouvrir Dialog
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Dialogue de test</DialogTitle>
              <DialogDescription>Composant Dialog branché via la façade core/ui.</DialogDescription>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => setAlertOpen(true)}>
            Ouvrir AlertDialog
          </Button>
          <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est uniquement un test de primitive.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction>Confirmer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted">
              Popover
            </PopoverTrigger>
            <PopoverContent className="max-w-xs text-sm text-muted-foreground">
              Contenu popover de test.
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted">
                Tooltip
              </TooltipTrigger>
              <TooltipContent>Texte d&apos;aide</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            onClick={() =>
              toast({
                title: 'Base UI',
                description: 'Toast déclenché depuis le UI Lab',
                variant: 'success',
              })
            }
          >
            Déclencher Toast
          </Button>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-background p-5">
        <h2 className="text-lg font-bold">Misc</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Avatar>
            <AvatarImage
              alt="Avatar"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&q=80"
            />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>

          <Progress value={62} className="w-48" />

          <Meter value={58} className="w-48 space-y-2">
            <MeterLabel className="text-xs font-medium text-muted-foreground">Impact</MeterLabel>
            <MeterTrack className="h-2 rounded-full bg-muted">
              <MeterIndicator className="h-full rounded-full bg-primary" />
            </MeterTrack>
            <MeterValue className="text-xs text-muted-foreground" />
          </Meter>

          <Toggle defaultPressed>Toggle</Toggle>
          <ToggleGroup defaultValue={['a']} multiple>
            <Toggle value="a">A</Toggle>
            <Toggle value="b">B</Toggle>
          </ToggleGroup>

          <NumberField defaultValue={2} max={10} min={0}>
            <NumberFieldGroup className="inline-flex h-10 items-center rounded-md border border-input">
              <NumberFieldDecrement className="px-3">-</NumberFieldDecrement>
              <NumberFieldInput className="h-full w-14 border-x border-input text-center text-sm" />
              <NumberFieldIncrement className="px-3">+</NumberFieldIncrement>
            </NumberFieldGroup>
          </NumberField>
        </div>

        <Separator />

        <Toolbar>
          <ToolbarGroup>
            <ToolbarButton>Bold</ToolbarButton>
            <ToolbarButton>Italic</ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarInput placeholder="Search..." />
          </ToolbarGroup>
        </Toolbar>

        <div className="flex flex-wrap items-center gap-3">
          <Menu>
            <MenuTrigger className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted">
              Menu
            </MenuTrigger>
            <MenuContent>
              <MenuItem>Action 1</MenuItem>
              <MenuItem>Action 2</MenuItem>
            </MenuContent>
          </Menu>

          <ContextMenu>
            <ContextMenuTrigger className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted">
              Clic droit
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Option A</ContextMenuItem>
              <ContextMenuItem>Option B</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          <Menubar>Menubar Root</Menubar>
        </div>
      </section>
    </div>
  )
}

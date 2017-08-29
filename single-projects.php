<?php


get_header(); ?>



<div class="container" role="main">
	<div class="row">
		<div class="col-sm-8">
			<?php 

				$image = get_field('project_image');

				if( !empty($image) ): ?>

					<img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" />

			<?php endif; ?>
		</div>

		<div class="col-sm-4">

			<?php while ( have_posts() ) : the_post(); ?>

				<h2><?php the_field('project_title'); ?></h2>

				<em><?php the_field('project_date'); ?></em>

				<a href="<?php the_field('project_url'); ?>"><?php the_field('project_url'); ?></a>

				<em><?php the_field('project_description'); ?></em>

				<p><?php the_field('project_description_2'); ?></p>

				<?php the_field('project_skills'); ?>

			<?php endwhile; // end of the loop. ?>

		</div>
	</div>
</div>

<?php get_footer(); ?>


